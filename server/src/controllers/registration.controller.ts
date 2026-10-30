// ==============================================================
/** Author: John Benedict Binas
 * Co-Authors: [Name]
 *
 * Description: Defines the account registration workflow controllers.
 * (1) Handles account creation per role (SUPER ADMIN, HQ ADMIN, BRANCH MANAGER, BRANCH MANAGER).
 * (2) Verifies the emailed account activation token.
 * (3) Completes the account registration by setting the user's new password.
 *
 * Note:
 *  Notice that there are similar POST methods for account creation for 3 roles. The code is repetitive, however I'm leaving it
 *  as is for now. The idea is, if there are additional account registration workflows that is specifc to a role, it is easily
 *  addable. However, keep in mind that if a feature that should apply to all registration routes should be added, it has to reflect
 *  to all 3 account registration routes.
 */
// ==============================================================

// General Imports
import type { Request, Response } from "express";

// BuyBuyin Shared Imports
import { RoleType, type User } from "@buybuyin/shared/prisma/client";
import {
    BusinessEntityRegistrationSchema,
    type BusinessEntityRegistrationSchemaType,
    AccountRegistrationSchema,
    type AccountRegistrationSchemaType,
    BranchEntityRegistrationSchema,
    type BranchEntityRegistrationSchemaType,
    CompleteAccountRegistrationSchema,
    type CompleteAccountRegistrationSchemaType,
} from "@buybuyin/shared/schema/registration";

// Middlewares
import { requireAccessLevel, requireValidResetToken } from "../middlewares/authorized.middleware";
import { validateSchema } from "../middlewares/zod.middleware";
import { jwtAccessAuth } from "../middlewares/passport.middleware";

// Services
import RegistrationService from "../service/registration.service";
import EmailService from "../service/email.service";

// Util
import HashUtil from "../utils/hash.util";

const FALLBACK_REGISTRATION_TOKEN_EXPIRATION = "1d";

export default {
    // --------------------- GET Routes --------------------------------
    businessesGet: [
        jwtAccessAuth,
        requireAccessLevel("HQADMIN", "minimum"),
        async (req: Request, res: Response) => {
            const businesses = await RegistrationService.getAllBusinesses();

            return res.json(businesses);
        },
    ],

    // Fetches branches scoped to the requestor's business (HQ ADMIN creates managers, BRANCH MANAGER creates cashiers)
    branchesGet: [
        jwtAccessAuth,
        requireAccessLevel("BRANCHMANAGER", "minimum"),
        async (req: Request, res: Response) => {
            const { businessId } = req.user as User;
            const branches = await RegistrationService.getBranchesByBusiness(businessId);

            return res.json(branches);
        },
    ],

    // Fetches all SUBSCRIBER (HQ ADMIN) accounts
    subscribersGet: [
        jwtAccessAuth,
        requireAccessLevel("SUPERADMIN", "exclusive"),
        async (req: Request, res: Response) => {
            const subscribers = await RegistrationService.getUsersByRole(RoleType.HQADMIN);

            return res.json(subscribers);
        },
    ],

    // Fetches all BRANCH MANAGER accounts scoped to the requestor's business
    managersGet: [
        jwtAccessAuth,
        requireAccessLevel("HQADMIN", "exclusive"),
        async (req: Request, res: Response) => {
            const { businessId } = req.user as User;
            const managers = await RegistrationService.getUsersByRole(RoleType.BRANCHMANAGER, businessId);

            return res.json(managers);
        },
    ],

    // Fetches all CASHIER accounts scoped to the requestor's business
    cashiersGet: [
        jwtAccessAuth,
        requireAccessLevel("BRANCHMANAGER", "exclusive"),
        async (req: Request, res: Response) => {
            const { businessId } = req.user as User;
            const cashiers = await RegistrationService.getUsersByRole(RoleType.CASHIER, businessId);

            return res.json(cashiers);
        },
    ],

    businessEntityPost: [
        jwtAccessAuth,
        requireAccessLevel("SUPERADMIN", "exclusive"),
        validateSchema("body", BusinessEntityRegistrationSchema),
        async (req: Request, res: Response) => {
            // Payload from the request
            const businessDataPayload: BusinessEntityRegistrationSchemaType = req.body;

            // Result of the service response
            const result = await RegistrationService.createNewBusinessEntity(businessDataPayload);

            return res.status(201).end();
        },
    ],

    branchEntityPost: [
        jwtAccessAuth,
        requireAccessLevel("SUPERADMIN", "exclusive"),
        validateSchema("body", BranchEntityRegistrationSchema),
        async (req: Request, res: Response) => {
            // Payload from the request
            const branchDataPayload: BranchEntityRegistrationSchemaType = req.body;

            // Result of the service response
            const result = await RegistrationService.createNewBranchEntity(branchDataPayload);

            return res.status(201).end();
        },
    ],

    // HQ ADMIN account creation route
    subscriberAccountPost: [
        jwtAccessAuth,
        requireAccessLevel("SUPERADMIN", "exclusive"),
        validateSchema("body", AccountRegistrationSchema),
        async (req: Request, res: Response) => {
            console.log("=========================================> REACHED");

            // Payload from the request
            const accountDataPayload: AccountRegistrationSchemaType = req.body;

            const isRegistered = await RegistrationService.emailAlreadyRegistered(accountDataPayload.email);

            if (isRegistered) {
                return res.status(400).json({ message: "Email already registered" });
            }

            // Result of the service response
            const user = await RegistrationService.createNewAccount(accountDataPayload, RoleType.HQADMIN);

            if (!!user) {
                // Generates hashed token for reset password URL query (e.g. /reset-password?token=209NF903H)
                const hashedToken = HashUtil.generateRandomHashedToken();

                const emailSent = await EmailService.sendRegistrationConfirmationEmal(
                    RoleType.HQADMIN,
                    hashedToken,
                    user.fullName as string,
                    user.email
                );

                // Only registers a reset token when the email has been sent sucessfully
                if (emailSent) {
                    const result = await RegistrationService.registerResetToken(
                        user.id,
                        hashedToken,
                        process.env.SMTP_ACCOUNT_REGISTRATION_EXPIRATION || FALLBACK_REGISTRATION_TOKEN_EXPIRATION
                    );
                }

                return res.status(201).end();
            }

            return res.status(400).end();
        },
    ],

    // Branch Manager account creation route
    managerAccountPost: [
        jwtAccessAuth,
        requireAccessLevel("HQADMIN", "exclusive"),
        validateSchema("body", AccountRegistrationSchema),
        async (req: Request, res: Response) => {
            // Payload from the request
            const accountDataPayload: AccountRegistrationSchemaType = req.body;

            const isRegistered = await RegistrationService.emailAlreadyRegistered(accountDataPayload.email);

            if (isRegistered) {
                return res.status(400).json({ message: "Email already registered" });
            }

            // Result of the service response
            const user = await RegistrationService.createNewAccount(accountDataPayload, RoleType.BRANCHMANAGER);

            if (!!user) {
                // Generates hashed token for reset password URL query (e.g. /reset-password?token=209NF903H)
                const hashedToken = HashUtil.generateRandomHashedToken();

                const emailSent = await EmailService.sendRegistrationConfirmationEmal(
                    RoleType.BRANCHMANAGER,
                    hashedToken,
                    user.fullName as string,
                    user.email
                );

                // Only registers a reset token when the email has been sent sucessfully
                if (emailSent) {
                    const result = await RegistrationService.registerResetToken(
                        user.id,
                        hashedToken,
                        process.env.SMTP_ACCOUNT_REGISTRATION_EXPIRATION || FALLBACK_REGISTRATION_TOKEN_EXPIRATION
                    );
                }

                return res.status(201).end();
            }

            return res.status(400).end();
        },
    ],

    // Cashier account creation route
    cashierAccountPost: [
        jwtAccessAuth,
        requireAccessLevel("BRANCHMANAGER", "exclusive"),
        validateSchema("body", AccountRegistrationSchema),
        async (req: Request, res: Response) => {
            // Payload from the request
            const accountDataPayload: AccountRegistrationSchemaType = req.body;

            const isRegistered = await RegistrationService.emailAlreadyRegistered(accountDataPayload.email);

            if (isRegistered) {
                return res.status(400).json({ message: "Email already registered" });
            }

            // Result of the service response
            const user = await RegistrationService.createNewAccount(accountDataPayload, RoleType.CASHIER);

            if (!!user) {
                // Generates hashed token for reset password URL query (e.g. /reset-password?token=209NF903H)
                const hashedToken = HashUtil.generateRandomHashedToken();

                const emailSent = await EmailService.sendRegistrationConfirmationEmal(
                    RoleType.CASHIER,
                    hashedToken,
                    user.fullName as string,
                    user.email
                );

                // Only registers a reset token when the email has been sent sucessfully
                if (emailSent) {
                    const result = await RegistrationService.registerResetToken(
                        user.id,
                        hashedToken,
                        process.env.SMTP_ACCOUNT_REGISTRATION_EXPIRATION || FALLBACK_REGISTRATION_TOKEN_EXPIRATION
                    );
                }

                return res.status(201).end();
            }

            return res.status(400).end();
        },
    ],

    verifyEmailRegistrationToken: [
        requireValidResetToken,
        async (req: Request, res: Response) => {
            const { email } = req.user as User;
            const [name, domain] = email.split("@");

            let returnMaskedEmail = "";

            // Fallback check if email still exist
            if (!name || !domain) {
                return res.status(401).json({ message: "Email is missing from user" });
            }

            // Checks if resetToken already expired
            else {
                // Show first char, mask middle chars, show last char of local part if long enough
                let maskedName = name[0] + "****";
                if (name.length > 2) {
                    maskedName = `${name[0]}****${name[name.length - 1]}`;
                }

                returnMaskedEmail = `${maskedName}@${domain}`;

                return res.status(200).json({
                    email: returnMaskedEmail,
                    isTokenExpired: false,
                });
            }
        },
    ],

    // Completes the account registration by setting the user's chosen password.
    // The reset token is validated first, then cleared once the password is stored.
    completeAccountRegistration: [
        requireValidResetToken,
        validateSchema("body", CompleteAccountRegistrationSchema),
        async (req: Request, res: Response) => {
            const user = req.user as User;
            const { password } = req.body as CompleteAccountRegistrationSchemaType;

            const hashedPassword = await HashUtil.hashPassword(password);

            await RegistrationService.completeAccountRegistration(user.id, hashedPassword);

            // Sends the success email confirming the account was registered and verified.
            await EmailService.sendAccountRegisteredSuccessEmail(user.fullName as string, user.email);

            return res.status(200).json({ message: "Account verified successfully." });
        },
    ],
};
