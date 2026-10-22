// Prisma.config
import prisma from "../config/prisma.config";

export default {
    async getSuppliersForBusiness(businessId: number) {
        return prisma.supplier.findMany({
            where: { products: { some: { businessId } } },
            orderBy: { supplierName: "asc" },
            select: { id: true, supplierName: true },
        });
    },

    async countForBusiness(businessId: number) {
        return prisma.supplier.count({ where: { products: { some: { businessId } } } });
    },

    async getSupplierById(id: number) {
        return prisma.supplier.findUnique({ where: { id } });
    },
};
