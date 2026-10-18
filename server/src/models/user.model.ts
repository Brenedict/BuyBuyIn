import type { RoleType, User } from "@buybuyin/shared/prisma/client";
import { type AccountRegistrationSchemaType } from "@buybuyin/shared/schema/registration";
import prisma from "../config/prisma.config";

export default {
    async getById(id: number): Promise<User | null> {
        return prisma.user.findUnique({
            where: { id },
        });
    },

    async getByEmail(email: string): Promise<User | null> {
        return prisma.user.findUnique({
            where: { email },
        });
    },

    async createUser(user: AccountRegistrationSchemaType, temporaryPassword: string, role: RoleType): Promise<User> {
        return prisma.user.create({
            data: {
                ...user,
                password: temporaryPassword,
                role,
            },
        });
    },
};
