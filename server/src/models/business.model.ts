import { type BusinessEntityRegistrationSchemaType } from "@buybuyin/shared/schema/registration";

import prisma from "../config/prisma.config";
import type { Business } from "@buybuyin/shared/prisma/client";

export default {
    async getById(id: number): Promise<Business | null> {
        return prisma.business.findUnique({
            where: { id },
        });
    },

    async createBusiness(business: BusinessEntityRegistrationSchemaType) {
        return prisma.business.create({
            data: business,
        });
    },
};
