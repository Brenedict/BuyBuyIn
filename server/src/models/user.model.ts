import type { User } from "@buybuyin/shared/prisma/client";

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
};
