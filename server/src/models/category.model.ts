// Prisma.config
import prisma from "../config/prisma.config";

export default {
    async getCategoriesForBusiness(businessId: number) {
        return prisma.category.findMany({
            where: { productCategories: { some: { product: { businessId } } } },
            orderBy: { categoryName: "asc" },
            select: { id: true, categoryName: true },
        });
    },

    async countForBusiness(businessId: number) {
        return prisma.category.count({ where: { productCategories: { some: { product: { businessId } } } } });
    },

    async getCategoryById(id: number) {
        return prisma.category.findUnique({ where: { id } });
    },
};
