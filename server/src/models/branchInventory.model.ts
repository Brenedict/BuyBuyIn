// BuyBuyin Shared Imports
import type {
    BranchInventoryItemCountArgs,
    BranchInventoryItemCreateArgs,
    BranchInventoryItemFindManyArgs,
    BranchInventoryItemUncheckedUpdateInput,
    BranchInventoryItemWhereInput,
} from "@buybuyin/shared/prisma/models";
import type { BranchInventoryStatusType } from "@buybuyin/shared/schema/branchInventory";

// Prisma.config
import prisma from "../config/prisma.config";

export const INVENTORY_SELECT = {
    id: true,
    quantity: true,
    reorderThreshold: true,
    product: {
        select: {
            id: true,
            productName: true,
            basePrice: true,
            shelfPrice: true,
            supplier: { select: { id: true, supplierName: true } },
            productCategories: { select: { category: { select: { id: true, categoryName: true } } } },
        },
    },
} as const;

// ----------------------------- PUBLIC FUNCTIONS ------------------------------------------

export default {
    INVENTORY_SELECT,

    async getItems(args?: BranchInventoryItemFindManyArgs) {
        return prisma.branchInventoryItem.findMany({ ...args, select: INVENTORY_SELECT });
    },

    async getItemById(id: number) {
        return prisma.branchInventoryItem.findUnique({ where: { id }, select: INVENTORY_SELECT });
    },

    async getItemForBranch(id: number, branchId: number) {
        return prisma.branchInventoryItem.findFirst({ where: { id, branchId }, select: INVENTORY_SELECT });
    },

    async getItemByProduct(productId: number, branchId: number) {
        return prisma.branchInventoryItem.findFirst({ where: { productId, branchId } });
    },

    async count(args?: BranchInventoryItemCountArgs) {
        return prisma.branchInventoryItem.count(args);
    },

    async getBranchSummaryRows(branchId: number) {
        return prisma.branchInventoryItem.findMany({
            where: { branchId },
            select: {
                quantity: true,
                reorderThreshold: true,
                product: {
                    select: {
                        shelfPrice: true,
                        productCategories: { select: { category: { select: { id: true } } } },
                    },
                },
            },
        });
    },

    async createItem(args: BranchInventoryItemCreateArgs) {
        return prisma.branchInventoryItem.create({ ...args, select: INVENTORY_SELECT });
    },

    async updateItemById(id: number, data: BranchInventoryItemUncheckedUpdateInput) {
        return prisma.branchInventoryItem.update({ where: { id }, data, select: INVENTORY_SELECT });
    },

    async deleteItemById(id: number) {
        return prisma.branchInventoryItem.delete({ where: { id } });
    },

    getStatusWhere(status: BranchInventoryStatusType): BranchInventoryItemWhereInput {
        switch (status) {
            case "OUT_OF_STOCK":
                return { quantity: { lte: 0 } };
            case "LOW_STOCK":
                return { quantity: { gt: 0, lte: prisma.branchInventoryItem.fields.reorderThreshold } };
            case "IN_STOCK":
                return { quantity: { gt: prisma.branchInventoryItem.fields.reorderThreshold } };
        }
    },
};
