// ==============================================================
/** Author: John Benedict Binas
 * Co-Authors: [Name]
 *
 * Description: Defines the account registration workflow controllers.
 * (1) Handles account creation per role (SUPER ADMIN, HQ ADMIN, BRANCH MANAGER, BRANCH MANAGER).
 * (2) Verifies the emailed account activation token.
 * (3) Completes the account registration by setting the user's new password.
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

export default {
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

                if (emailSent) {
                    const result = await RegistrationService.registerResetToken(
                        user.id,
                        hashedToken,
                        process.env.SMTP_EXPIRATION_OFFSET || "5m"
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

                if (emailSent) {
                    const result = await RegistrationService.registerResetToken(
                        user.id,
                        hashedToken,
                        process.env.SMTP_EXPIRATION_OFFSET || "5m"
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

                if (emailSent) {
                    const result = await RegistrationService.registerResetToken(
                        user.id,
                        hashedToken,
                        process.env.SMTP_EXPIRATION_OFFSET || "5m"
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
