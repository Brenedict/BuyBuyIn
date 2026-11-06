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
    BusinessEntityUpdateSchema,
    type BusinessEntityUpdateSchemaType,
    AccountRegistrationSchema,
    type AccountRegistrationSchemaType,
    AccountUpdateSchema,
    type AccountUpdateSchemaType,
    BranchEntityRegistrationSchema,
    type BranchEntityRegistrationSchemaType,
    BranchEntityUpdateSchema,
    type BranchEntityUpdateSchemaType,
    CompleteAccountRegistrationSchema,
    type CompleteAccountRegistrationSchemaType,
    ManageAccountStatusSchema,
    type ManageAccountStatusSchemaType,
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
import { HttpError } from "../utils/error.util";

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
        requireAccessLevel("HQADMIN", "exclusive"),
        validateSchema("body", BranchEntityRegistrationSchema),
        async (req: Request, res: Response) => {
            // A branch is always attached to the HQ Admin's own business, never to a selected business.
            const requestor = req.user as User;
            const businessId = requestor.businessId;

            if (!businessId) {
                return res.status(400).json({ message: "HQ admin is not attached to a business." });
            }

            // Payload from the request + the HQ Admin's business assignment
            const branchDataPayload: BranchEntityRegistrationSchemaType & { businessId: number } = {
                ...(req.body as BranchEntityRegistrationSchemaType),
                businessId,
            };

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

                const result = await RegistrationService.registerResetToken(
                    user.id,
                    hashedToken,
                    process.env.SMTP_ACCOUNT_REGISTRATION_EXPIRATION || FALLBACK_REGISTRATION_TOKEN_EXPIRATION
                );

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

                const result = await RegistrationService.registerResetToken(
                    user.id,
                    hashedToken,
                    process.env.SMTP_ACCOUNT_REGISTRATION_EXPIRATION || FALLBACK_REGISTRATION_TOKEN_EXPIRATION
                );

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

                const result = await RegistrationService.registerResetToken(
                    user.id,
                    hashedToken,
                    process.env.SMTP_ACCOUNT_REGISTRATION_EXPIRATION || FALLBACK_REGISTRATION_TOKEN_EXPIRATION
                );

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

    // ----------------------------- EDIT / MANAGE / DELETE ROUTES -----------------------------
    // Business: single fetch, update, delete (SUPER ADMIN only)
    businessSingleGet: [
        jwtAccessAuth,
        requireAccessLevel("SUPERADMIN", "exclusive"),
        async (req: Request, res: Response) => {
            const businessId = parseEntityId(req.params.businessId, "Business not found");
            const business = await RegistrationService.getBusinessById(businessId);
            if (!business) return res.status(404).json({ message: "Business not found" });

            return res.json(business);
        },
    ],

    businessPatch: [
        jwtAccessAuth,
        requireAccessLevel("SUPERADMIN", "exclusive"),
        validateSchema("body", BusinessEntityUpdateSchema),
        async (req: Request, res: Response) => {
            const businessId = parseEntityId(req.params.businessId, "Business not found");
            const payload = req.body as BusinessEntityUpdateSchemaType;

            await RegistrationService.updateBusinessEntity(businessId, payload);

            return res.json({ message: "Business updated" });
        },
    ],

    businessDelete: [
        jwtAccessAuth,
        requireAccessLevel("SUPERADMIN", "exclusive"),
        async (req: Request, res: Response) => {
            const businessId = parseEntityId(req.params.businessId, "Business not found");

            await RegistrationService.deleteBusinessEntity(businessId);

            return res.json({ message: "Business deleted" });
        },
    ],

    // Branch: single fetch, update, delete (HQ ADMIN, scoped to own business)
    branchSingleGet: [
        jwtAccessAuth,
        requireAccessLevel("HQADMIN", "exclusive"),
        async (req: Request, res: Response) => {
            const requestor = req.user as User;
            const branchId = parseEntityId(req.params.branchId, "Branch not found");
            const branch = await RegistrationService.getBranchById(branchId);
            if (!branch) return res.status(404).json({ message: "Branch not found" });

            RegistrationService.assertSameBusiness(branch.businessId, requestor.businessId);

            return res.json(branch);
        },
    ],

    branchPatch: [
        jwtAccessAuth,
        requireAccessLevel("HQADMIN", "exclusive"),
        validateSchema("body", BranchEntityUpdateSchema),
        async (req: Request, res: Response) => {
            const requestor = req.user as User;
            const branchId = parseEntityId(req.params.branchId, "Branch not found");
            const payload = req.body as BranchEntityUpdateSchemaType;

            await RegistrationService.updateBranchEntity(branchId, payload);
            const updated = await RegistrationService.getBranchById(branchId);
            RegistrationService.assertSameBusiness(updated?.businessId, requestor.businessId);

            return res.json({ message: "Branch updated" });
        },
    ],

    branchDelete: [
        jwtAccessAuth,
        requireAccessLevel("HQADMIN", "exclusive"),
        async (req: Request, res: Response) => {
            const requestor = req.user as User;
            const branchId = parseEntityId(req.params.branchId, "Branch not found");
            const existing = await RegistrationService.getBranchById(branchId);
            if (!existing) return res.status(404).json({ message: "Branch not found" });

            RegistrationService.assertSameBusiness(existing.businessId, requestor.businessId);

            // CASCADE delete: inventory + offer junctions are removed, users/transactions are orphaned.
            await RegistrationService.deleteBranchEntity(branchId);

            return res.json({ message: "Branch deleted" });
        },
    ],

    // Subscriber (HQ ADMIN): single fetch, update, delete (SUPER ADMIN only)
    subscriberSingleGet: [
        jwtAccessAuth,
        requireAccessLevel("SUPERADMIN", "exclusive"),
        async (req: Request, res: Response) => {
            const userId = parseEntityId(req.params.userId, "Subscriber account not found");
            const account = await RegistrationService.getUserById(userId);
            if (!account || account.role !== RoleType.HQADMIN) {
                return res.status(404).json({ message: "Subscriber account not found" });
            }

            return res.json(account);
        },
    ],

    subscriberDeleteContextGet: [
        jwtAccessAuth,
        requireAccessLevel("SUPERADMIN", "exclusive"),
        async (req: Request, res: Response) => {
            const userId = parseEntityId(req.params.userId, "Subscriber account not found");
            const context = await RegistrationService.getSubscriberDeleteContext(userId);

            return res.json(context);
        },
    ],

    subscriberPatch: [
        jwtAccessAuth,
        requireAccessLevel("SUPERADMIN", "exclusive"),
        validateSchema("body", AccountUpdateSchema),
        async (req: Request, res: Response) => {
            const userId = parseEntityId(req.params.userId, "Subscriber account not found");
            const payload = req.body as AccountUpdateSchemaType;

            await RegistrationService.updateSubscriberAccount(userId, payload);

            return res.json({ message: "Subscriber updated" });
        },
    ],

    subscriberDelete: [
        jwtAccessAuth,
        requireAccessLevel("SUPERADMIN", "exclusive"),
        async (req: Request, res: Response) => {
            const userId = parseEntityId(req.params.userId, "Subscriber account not found");

            await RegistrationService.deleteUserById(userId);

            return res.json({ message: "Subscriber deleted" });
        },
    ],

    // Branch Manager: single fetch, update, delete (HQ ADMIN, scoped to own business)
    managerSingleGet: [
        jwtAccessAuth,
        requireAccessLevel("HQADMIN", "exclusive"),
        async (req: Request, res: Response) => {
            const requestor = req.user as User;
            const userId = parseEntityId(req.params.userId, "Manager account not found");
            const account = await RegistrationService.getUserById(userId);
            if (!account || account.role !== RoleType.BRANCHMANAGER) {
                return res.status(404).json({ message: "Manager account not found" });
            }

            RegistrationService.assertSameBusiness(account.businessId, requestor.businessId);

            return res.json(account);
        },
    ],

    managerDeleteContextGet: [
        jwtAccessAuth,
        requireAccessLevel("HQADMIN", "exclusive"),
        async (req: Request, res: Response) => {
            const requestor = req.user as User;
            const userId = parseEntityId(req.params.userId, "Manager account not found");
            const context = await RegistrationService.getManagerDeleteContext(userId);

            RegistrationService.assertSameBusiness(context.account.businessId, requestor.businessId);

            return res.json(context);
        },
    ],

    managerPatch: [
        jwtAccessAuth,
        requireAccessLevel("HQADMIN", "exclusive"),
        validateSchema("body", AccountUpdateSchema),
        async (req: Request, res: Response) => {
            const requestor = req.user as User;
            const userId = parseEntityId(req.params.userId, "Manager account not found");
            const payload = req.body as AccountUpdateSchemaType;

            await RegistrationService.updateManagerAccount(userId, payload, requestor.businessId);

            return res.json({ message: "Manager updated" });
        },
    ],

    managerDelete: [
        jwtAccessAuth,
        requireAccessLevel("HQADMIN", "exclusive"),
        async (req: Request, res: Response) => {
            const requestor = req.user as User;
            const userId = parseEntityId(req.params.userId, "Manager account not found");
            const existing = await RegistrationService.getUserById(userId);
            if (!existing || existing.role !== RoleType.BRANCHMANAGER) {
                return res.status(404).json({ message: "Manager account not found" });
            }

            RegistrationService.assertSameBusiness(existing.businessId, requestor.businessId);

            await RegistrationService.deleteUserById(userId);

            return res.json({ message: "Manager deleted" });
        },
    ],

    // Cashier: single fetch, update, delete (BRANCH MANAGER, scoped to own business)
    cashierSingleGet: [
        jwtAccessAuth,
        requireAccessLevel("BRANCHMANAGER", "exclusive"),
        async (req: Request, res: Response) => {
            const requestor = req.user as User;
            const userId = parseEntityId(req.params.userId, "Cashier account not found");
            const account = await RegistrationService.getUserById(userId);
            if (!account || account.role !== RoleType.CASHIER) {
                return res.status(404).json({ message: "Cashier account not found" });
            }

            RegistrationService.assertSameBusiness(account.businessId, requestor.businessId);

            return res.json(account);
        },
    ],

    cashierPatch: [
        jwtAccessAuth,
        requireAccessLevel("BRANCHMANAGER", "exclusive"),
        validateSchema("body", AccountUpdateSchema),
        async (req: Request, res: Response) => {
            const requestor = req.user as User;
            const userId = parseEntityId(req.params.userId, "Cashier account not found");
            const payload = req.body as AccountUpdateSchemaType;

            await RegistrationService.updateCashierAccount(userId, payload, requestor.businessId);

            return res.json({ message: "Cashier updated" });
        },
    ],

    cashierDelete: [
        jwtAccessAuth,
        requireAccessLevel("BRANCHMANAGER", "exclusive"),
        async (req: Request, res: Response) => {
            const requestor = req.user as User;
            const userId = parseEntityId(req.params.userId, "Cashier account not found");
            const existing = await RegistrationService.getUserById(userId);
            if (!existing || existing.role !== RoleType.CASHIER) {
                return res.status(404).json({ message: "Cashier account not found" });
            }

            RegistrationService.assertSameBusiness(existing.businessId, requestor.businessId);

            await RegistrationService.deleteUserById(userId);

            return res.json({ message: "Cashier deleted" });
        },
    ],

    // Account status (deactivate/reactivate) used by the Manage radio popup.
    // Each role may only manage the account tier directly below it, and only within its own business.
    accountStatusPatch: [
        jwtAccessAuth,
        requireAccessLevel("BRANCHMANAGER", "minimum"),
        validateSchema("body", ManageAccountStatusSchema),
        async (req: Request, res: Response) => {
            const requestor = req.user as User;
            const userId = parseEntityId(req.params.userId, "Account not found");
            const { action } = req.body as ManageAccountStatusSchemaType;

            const target = await RegistrationService.getUserById(userId);
            if (!target) return res.status(404).json({ message: "Account not found" });

            if (target.id === requestor.id) {
                return res.status(400).json({ message: "You cannot manage your own account" });
            }

            const manageableRole =
                requestor.role === RoleType.SUPERADMIN
                    ? RoleType.HQADMIN
                    : requestor.role === RoleType.HQADMIN
                      ? RoleType.BRANCHMANAGER
                      : RoleType.CASHIER;

            if (target.role !== manageableRole) {
                return res.status(403).json({ message: "Forbidden: You cannot manage this account" });
            }

            RegistrationService.assertSameBusiness(target.businessId, requestor.businessId);

            await RegistrationService.manageAccountStatus(userId, action);

            const resultMessage = action === "deactivate" ? "Account deactivated" : "Account reactivated";

            return res.json({ message: resultMessage });
        },
    ],

    // Resends the email verification link to an unverified account whose verification
    // token has expired (or was cleared after an expired link was opened).
    resendVerificationEmailPost: [
        jwtAccessAuth,
        requireAccessLevel("BRANCHMANAGER", "minimum"),
        async (req: Request, res: Response) => {
            const requestor = req.user as User;
            const userId = parseEntityId(req.params.userId, "Account not found");

            const target = await RegistrationService.getUserById(userId);
            if (!target) return res.status(404).json({ message: "Account not found" });

            if (target.id === requestor.id) {
                return res.status(400).json({ message: "You cannot resend verification to your own account" });
            }

            const manageableRole =
                requestor.role === RoleType.SUPERADMIN
                    ? RoleType.HQADMIN
                    : requestor.role === RoleType.HQADMIN
                      ? RoleType.BRANCHMANAGER
                      : RoleType.CASHIER;

            if (target.role !== manageableRole) {
                return res.status(403).json({ message: "Forbidden: You cannot manage this account" });
            }

            if (target.accountStatus !== "UNVERIFIED") {
                return res.status(400).json({ message: "Account is already verified" });
            }

            if (target.resetToken) {
                const expiresAt = target.resetTokenExpiresAt
                    ? new Date(target.resetTokenExpiresAt).getTime()
                    : Infinity;
                if (expiresAt >= Date.now()) {
                    return res.status(400).json({ message: "A verification link is already active for this account" });
                }
            }

            RegistrationService.assertSameBusiness(target.businessId, requestor.businessId);

            await RegistrationService.resendVerificationEmail(userId);

            return res.json({ message: "Verification email resent" });
        },
    ],
};

const parseEntityId = (raw: string | string[] | undefined, notFoundMessage: string): number => {
    if (typeof raw !== "string") {
        throw new HttpError(404, notFoundMessage);
    }

    const id = Number(raw);
    if (!Number.isInteger(id) || id <= 0) {
        throw new HttpError(404, notFoundMessage);
    }

    return id;
};
