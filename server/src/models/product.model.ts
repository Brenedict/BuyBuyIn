// BuyBuyin Shared Imports
import type {
    ProductAggregateArgs,
    ProductCountArgs,
    ProductCreateArgs,
    ProductFindManyArgs,
    ProductUncheckedUpdateInput,
} from "@buybuyin/shared/prisma/models";

// Prisma.config
import prisma from "../config/prisma.config";

export const PRODUCT_SELECT = {
    id: true,
    productName: true,
    basePrice: true,
    shelfPrice: true,
    supplier: { select: { id: true, supplierName: true } },
    productCategories: { select: { category: { select: { id: true, categoryName: true } } } },
} as const;

// ----------------------------- PUBLIC FUNCTIONS ------------------------------------------

export default {
    PRODUCT_SELECT,

    async getProducts(args?: ProductFindManyArgs) {
        return prisma.product.findMany({ ...args, select: PRODUCT_SELECT });
    },

    async getProductById(id: number) {
        return prisma.product.findUnique({ where: { id }, select: PRODUCT_SELECT });
    },

    async getProductForBusiness(id: number, businessId: number) {
        return prisma.product.findFirst({ where: { id, businessId }, select: PRODUCT_SELECT });
    },

    async getProductsNotStockedInBranch(businessId: number, branchId: number) {
        return prisma.product.findMany({
            where: { businessId, branchInventoryItems: { none: { branchId } } },
            orderBy: { productName: "asc" },
            select: PRODUCT_SELECT,
        });
    },

    async count(args?: ProductCountArgs) {
        return prisma.product.count(args);
    },

    async aggregate(args: ProductAggregateArgs) {
        return prisma.product.aggregate(args);
    },

    async createProduct(args: ProductCreateArgs) {
        return prisma.product.create({ ...args, select: PRODUCT_SELECT });
    },

    async updateProductById(id: number, data: ProductUncheckedUpdateInput) {
        return prisma.product.update({ where: { id }, data, select: PRODUCT_SELECT });
    },

    async getProductDeleteState(id: number) {
        return prisma.product.findUnique({
            where: { id },
            select: {
                _count: { select: { branchInventoryItems: true, transactionItems: true } },
            },
        });
    },

    async deleteProductCascade(id: number) {
        return prisma.$transaction([
            prisma.branchInventoryItem.deleteMany({ where: { productId: id } }),
            prisma.productCategory.deleteMany({ where: { productId: id } }),
            prisma.product.delete({ where: { id } }),
        ]);
    },
};
