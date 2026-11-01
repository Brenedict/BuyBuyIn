import {
    type BusinessEntityRegistrationSchemaType,
    type BusinessEntityUpdateSchemaType,
} from "@buybuyin/shared/schema/registration";

import prisma from "../config/prisma.config";
import type { Business } from "@buybuyin/shared/prisma/client";

export default {
    async getById(id: number): Promise<Business | null> {
        return prisma.business.findUnique({
            where: { id },
        });
    },

    async getAll(): Promise<Business[]> {
        return prisma.business.findMany({
            orderBy: { name: "asc" },
        });
    },

    async createBusiness(business: BusinessEntityRegistrationSchemaType) {
        return prisma.business.create({
            data: business,
        });
    },

    async updateBusiness(id: number, business: BusinessEntityUpdateSchemaType): Promise<Business> {
        return prisma.business.update({
            where: { id },
            data: business,
        });
    },

    // NOTE: Deletes only the Business row. Linked rows (branches, users, products, suppliers,
    // business subscriptions) are ORPHANED via the DB's SET NULL constraints, never cascade-deleted.
    async deleteBusiness(id: number): Promise<Business> {
        return prisma.business.delete({
            where: { id },
        });
    },
};
