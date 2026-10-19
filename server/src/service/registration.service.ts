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

    createNewBranchEntity(branch: BranchEntityRegistrationSchemaType) {
        return BranchModel.createBranch(branch);
    },

    // Routes defined the role per account creation.
    // Prevents client from providing a custom role in the request body.
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
        // Expiration 3 minutes from now
        const resetTokenExpires = DateUtil.getExpirationDate(expirationOffset);

        // Stores tokens used in password reset link
        const updatedUser = {
            resetToken: hashedToken.toString(),
            resetTokenExpiresAt: resetTokenExpires,
        } as User;

        return await UserModel.updateUser(userId, updatedUser);
    },
};
