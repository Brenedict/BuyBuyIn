import prisma from "../config/prisma.config";

export const TRANSACTION_ITEM_SELECT = {
    id: true,
    transactionId: true,
    productId: true,
    branchWideOfferId: true,
    quantity: true,
    currentPrice: true,
    isBundle: true,
} as const;

export default {
    async getTransactionItems(transactionId: number) {
        return prisma.transactionItem.findMany({
            where: { transactionId },
            orderBy: { id: "asc" },
            select: TRANSACTION_ITEM_SELECT,
        });
    },

    async getTransactionItem(transactionId: number, itemId: number) {
        return prisma.transactionItem.findFirst({
            where: { id: itemId, transactionId },
            select: TRANSACTION_ITEM_SELECT,
        });
    },
};