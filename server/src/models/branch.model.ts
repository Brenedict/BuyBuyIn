import { type BranchEntityRegistrationSchemaType } from "@buybuyin/shared/schema/registration";

import prisma from "../config/prisma.config";
import type { Branch } from "@buybuyin/shared/prisma/client";

export default {
    async getById(id: number): Promise<Branch | null> {
        return prisma.branch.findUnique({
            where: { id },
        });
    },

    async createBranch(branch: BranchEntityRegistrationSchemaType) {
        return prisma.branch.create({
            data: branch,
        });
    },
};
