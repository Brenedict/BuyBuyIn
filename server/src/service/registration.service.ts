// ==============================================================
/** Author: John Benedict Binas
 * Co-Authors: [Name]
 *
 * Description: Service layer for the account registration workflow.
 * (1) Creates new accounts (temporary password + reset token) per role.
 * (2) Registers the reset token used for account activation.
 * (3) Completes the account registration by storing the final password.
 */
// ==============================================================

// BuyBuyIn Imports
import type { RoleType, User } from "@buybuyin/shared/prisma/client";
import {
    type BusinessEntityRegistrationSchemaType,
    type BusinessEntityUpdateSchemaType,
    type AccountRegistrationSchemaType,
    type AccountUpdateSchemaType,
    type BranchEntityRegistrationSchemaType,
    type BranchEntityUpdateSchemaType,
    type DeleteContextData,
} from "@buybuyin/shared/schema/registration";

// Models
import BusinessModel from "../models/business.model";
import UserModel from "../models/user.model";
import BranchModel from "../models/branch.model";

// Services
import EmailService, { type AssignableRole } from "./email.service";

// Utils
import HashUtil from "../utils/hash.util";
import DateUtil from "../utils/date.util";
import { HttpError } from "../utils/error.util";

const ACCOUNT_STATUS_UPDATE = {
    deactivate: "DEACTIVATED",
    reactivate: "ACTIVE",
} as const;

const FALLBACK_REGISTRATION_TOKEN_EXPIRATION = "1d";

export default {
    createNewBusinessEntity(business: BusinessEntityRegistrationSchemaType) {
        return BusinessModel.createBusiness(business);
    },

    getAllBusinesses() {
        return BusinessModel.getAll();
    },

    getBranchesByBusiness(businessId?: number | null) {
        return businessId ? BranchModel.getByBusinessId(businessId) : Promise.resolve([]);
    },

    getUsersByRole(role: RoleType, businessId?: number | null) {
        return UserModel.getByRole(role, businessId);
    },

    createNewBranchEntity(branch: BranchEntityRegistrationSchemaType & { businessId: number }) {
        return BranchModel.createBranch(branch);
    },

    // Routes defined the role per account creation.
    async createNewAccount(user: AccountRegistrationSchemaType, role: RoleType) {
        // Generate a temporary password for the new user account
        // Actual passwords should be set by the user themselves after account creation, via a password reset flow.
        const temporaryPassword = await HashUtil.generateRandomPassword();

        return UserModel.createUser(user, temporaryPassword, role);
    },

    async emailAlreadyRegistered(email: string) {
        const user = await UserModel.getByEmail(email);
        return !!user;
    },

    async registerResetToken(userId: number, hashedToken: string, expirationOffset: string) {
        const resetTokenExpires = DateUtil.getExpirationDate(expirationOffset);

        // Stores tokens used in password reset link
        const updatedUser = {
            resetToken: hashedToken.toString(),
            resetTokenExpiresAt: resetTokenExpires,
        } as User;

        // NOTE: This is for testing only, to be removed in actuality
        console.log(
            "\n\n========================================== THIS IS FOR TESTING PURPOSES ONLY =========================================="
        );
        console.log("Email Verification Link: ", `${process.env.FRONTEND_URL}/verify-email?token=${hashedToken}`);
        console.log(
            "======================================================================================================================\n\n"
        );

        return await UserModel.updateUser(userId, updatedUser);
    },

    // Resends the email verification link to an unverified account. Generates a new token,
    // sends the confirmation email, and stores the new token + expiry on the user row.
    async resendVerificationEmail(userId: number) {
        const existing = await UserModel.getById(userId);
        if (!existing) throw new HttpError(404, "Account not found");

        if (existing.accountStatus !== "UNVERIFIED") {
            throw new HttpError(400, "Account is already verified");
        }

        // Generates hashed token for reset password URL query (e.g. /reset-password?token=209NF903H)
        const hashedToken = HashUtil.generateRandomHashedToken();

        const emailSent = await EmailService.sendRegistrationConfirmationEmal(
            existing.role as AssignableRole,
            hashedToken,
            existing.fullName as string,
            existing.email
        );

        // Only registers a reset token when the email has been sent successfully
        if (!emailSent) {
            throw new HttpError(500, "Failed to send verification email");
        }

        return await this.registerResetToken(
            userId,
            hashedToken,
            process.env.SMTP_ACCOUNT_REGISTRATION_EXPIRATION || FALLBACK_REGISTRATION_TOKEN_EXPIRATION
        );
    },

    // Completes the account setup: sets the user's real password, marks the account active, and clears the reset token.
    async completeAccountRegistration(userId: number, hashedPassword: string) {
        const updatedUser = {
            password: hashedPassword,
            accountStatus: "ACTIVE",
            resetToken: null,
            resetTokenExpiresAt: null,
        } as User;

        return UserModel.updateUser(userId, updatedUser);
    },

    // ----------------------------- EDIT / MANAGE / DELETE ---------------------------------
    async getBusinessById(businessId: number) {
        return BusinessModel.getById(businessId);
    },

    async updateBusinessEntity(businessId: number, business: BusinessEntityUpdateSchemaType) {
        const existing = await BusinessModel.getById(businessId);
        if (!existing) throw new HttpError(404, "Business not found");

        return BusinessModel.updateBusiness(businessId, business);
    },

    // Deletes only the Business row; linked rows are left orphaned (FKs SET NULL), never cascade-deleted.
    async deleteBusinessEntity(businessId: number) {
        const existing = await BusinessModel.getById(businessId);
        if (!existing) throw new HttpError(404, "Business not found");

        return BusinessModel.deleteBusiness(businessId);
    },

    // Resolves the branch's businessId so a manager/cashier's business always follows its branch.
    async resolveBranchBusiness(branchId: number) {
        const branch = await BranchModel.getById(branchId);
        if (!branch) throw new HttpError(400, "Branch not found");

        return branch.businessId;
    },

    async getBranchById(branchId: number) {
        return BranchModel.getById(branchId);
    },

    async updateBranchEntity(branchId: number, branch: BranchEntityUpdateSchemaType) {
        const existing = await BranchModel.getById(branchId);
        if (!existing) throw new HttpError(404, "Branch not found");

        return BranchModel.updateBranch(branchId, branch);
    },

    async deleteBranchEntity(branchId: number) {
        const existing = await BranchModel.getById(branchId);
        if (!existing) throw new HttpError(404, "Branch not found");

        return BranchModel.deleteBranchCascade(branchId);
    },

    async getUserById(userId: number) {
        return UserModel.getByIdWithRelations(userId);
    },

    // Updates a subscriber (HQ ADMIN) account: FN/LN/email and optionally reassigns its business.
    async updateSubscriberAccount(userId: number, user: AccountUpdateSchemaType) {
        const existing = await this.getUserById(userId);
        if (!existing || existing.role !== "HQADMIN") throw new HttpError(404, "Subscriber account not found");

        const { businessId, ...fields } = user;
        return UserModel.updateUser(userId, { ...fields, ...(businessId !== undefined && { businessId }) });
    },

    // Updates a branch manager account: FN/LN/email and optionally reassigns its branch (business follows the branch).
    async updateManagerAccount(userId: number, user: AccountUpdateSchemaType, requestorBusinessId?: number | null) {
        const existing = await this.getUserById(userId);
        if (!existing || existing.role !== "BRANCHMANAGER") throw new HttpError(404, "Manager account not found");
        this.assertSameBusiness(existing.businessId, requestorBusinessId);

        const { businessId: _ignored, branchId, ...fields } = user;
        const data: { branchId?: number | null; businessId?: number | null } = {};

        if (branchId !== undefined) {
            data.branchId = branchId;
            data.businessId = branchId === null ? null : ((await this.resolveBranchBusiness(branchId)) ?? null);
        }

        return UserModel.updateUser(userId, { ...fields, ...data });
    },

    // Updates a cashier account: FN/LN/email and optionally reassigns its branch (business follows the branch).
    async updateCashierAccount(userId: number, user: AccountUpdateSchemaType, requestorBusinessId?: number | null) {
        const existing = await this.getUserById(userId);
        if (!existing || existing.role !== "CASHIER") throw new HttpError(404, "Cashier account not found");
        this.assertSameBusiness(existing.businessId, requestorBusinessId);

        const { businessId: _ignored, branchId, ...fields } = user;
        const data: { branchId?: number | null; businessId?: number | null } = {};

        if (branchId !== undefined) {
            data.branchId = branchId;
            data.businessId = branchId === null ? null : ((await this.resolveBranchBusiness(branchId)) ?? null);
        }

        return UserModel.updateUser(userId, { ...fields, ...data });
    },

    // Deactivates / reactivates an account (used by the Manage radio popup).
    async manageAccountStatus(userId: number, action: "deactivate" | "reactivate") {
        const existing = await UserModel.getById(userId);
        if (!existing) throw new HttpError(404, "Account not found");

        const accountStatus = ACCOUNT_STATUS_UPDATE[action];
        return UserModel.updateUser(userId, { accountStatus });
    },

    // Deletes an account row. Historic transactions are preserved (the DB SET NULLs Transaction.userId).
    async deleteUserById(userId: number) {
        const existing = await UserModel.getById(userId);
        if (!existing) throw new HttpError(404, "Account not found");

        return UserModel.deleteUser(userId);
    },

    // Subscriber delete-confirmation context: how many other HQ ADMINS remain linked to the same business.
    async getSubscriberDeleteContext(userId: number): Promise<DeleteContextData> {
        const account = await this.getUserById(userId);
        if (!account || account.role !== "HQADMIN") throw new HttpError(404, "Subscriber account not found");

        const remainingCount = await UserModel.countOtherSubscribersByBusiness(account.businessId, userId);

        return { account, remainingCount };
    },

    // Manager delete-confirmation context: how many other managers remain linked to the same branch.
    async getManagerDeleteContext(userId: number): Promise<DeleteContextData> {
        const account = await this.getUserById(userId);
        if (!account || account.role !== "BRANCHMANAGER") throw new HttpError(404, "Manager account not found");

        const remainingCount = await UserModel.countOtherManagersByBranch(account.branchId, userId);

        return { account, remainingCount };
    },

    // Guards that a manager/cashier edit by a business-scoped admin stays inside their own business.
    assertSameBusiness(targetBusinessId: number | null | undefined, requestorBusinessId?: number | null) {
        if (requestorBusinessId === undefined || requestorBusinessId === null) return;
        if (targetBusinessId !== requestorBusinessId) {
            throw new HttpError(403, "Account does not belong to your business");
        }
    },
};
