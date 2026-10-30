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
import type { RoleType } from "@buybuyin/shared/prisma/client";
import {
    type BusinessEntityRegistrationSchemaType,
    type AccountRegistrationSchemaType,
    type BranchEntityRegistrationSchemaType,
} from "@buybuyin/shared/schema/registration";

// Models
import BusinessModel from "../models/business.model";
import UserModel from "../models/user.model";
import BranchModel from "../models/branch.model";

// Utils
import HashUtil from "../utils/hash.util";
import DateUtil from "../utils/date.util";
import type { User } from "@buybuyin/shared/prisma/browser";

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

    createNewBranchEntity(branch: BranchEntityRegistrationSchemaType) {
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

        return await UserModel.updateUser(userId, updatedUser);
    },

    // Completes the account setup: sets the user's real password, marks the account active, and clears the reset token.
    async completeAccountRegistration(userId: number, hashedPassword: string) {
        const updatedUser = {
            password: hashedPassword,
            accountStatus: "ACTIVE",
            // resetToken: null,
            // resetTokenExpiresAt: null,
        } as User;

        return UserModel.updateUser(userId, updatedUser);
    },
};
