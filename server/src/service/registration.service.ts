import {
    type BusinessEntityRegistrationSchemaType,
    type AccountRegistrationSchemaType,
} from "@buybuyin/shared/schema/registration";

import BusinessModel from "../models/business.model";
import UserModel from "../models/user.model";
import HashUtil from "../utils/hash.util";
import type { RoleType } from "@buybuyin/shared/prisma/client";

export default {
    createNewBusinessEntity(business: BusinessEntityRegistrationSchemaType) {
        return BusinessModel.createBusiness(business);
    },

    // Routes defined the role per account creation.
    // Prevents client from providing a custom role in the request body.
    async createNewAccount(user: AccountRegistrationSchemaType, role: RoleType) {
        // Generate a temporary password for the new user account
        // Actual passwords should be set by the user themselves after account creation, via a password reset flow.
        const temporaryPassword = await HashUtil.generateRandomPassword();

        return UserModel.createUser(user, temporaryPassword, role);
    },
};
