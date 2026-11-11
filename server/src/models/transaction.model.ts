// BuyBuyin Shared Imports
import type {
    TransactionAggregateArgs,
    TransactionCountArgs,
    TransactionCreateArgs,
    TransactionFindManyArgs,
    TransactionUncheckedUpdateInput,
} from "@buybuyin/shared/prisma/models";

// Prisma.config
import prisma from "../config/prisma.config";

export const TRANSACTION_SELECT = {
    id: true,
    totalPrice: true,
    dateofTransaction: true,
    paymentMethod: true,
    status: true,
    discount: true,
    branch: { select: { id: true, location: true } },
    user: { select: { id: true, firstName: true, lastName: true } },
    transactionItems: {
        select: {
            id: true,
            quantity: true,
            currentPrice: true,
            isBundle: true,
            productId: true,
            branchWideOfferId: true,
        },
    },
} as const;

// ----------------------------- PUBLIC FUNCTIONS ------------------------------------------

export default {
    async getTransactions(args?: TransactionFindManyArgs) {
        return prisma.transaction.findMany({
            ...args,
            select: TRANSACTION_SELECT,
        });
    },

    async getTransactionById(id: number) {
        return prisma.transaction.findUnique({
            where: { id },
            select: TRANSACTION_SELECT,
        });
    },

    async count(args?: TransactionCountArgs) {
        return prisma.transaction.count(args);
    },

    async aggregate(args: TransactionAggregateArgs) {
        return prisma.transaction.aggregate(args);
    },

    async createTransaction(args: TransactionCreateArgs) {
        return prisma.transaction.create({
            ...args,
            select: TRANSACTION_SELECT,
        });
    },

    async updateTransactionById(id: number, data: TransactionUncheckedUpdateInput) {
        return prisma.transaction.update({
            where: { id },
            data,
            select: TRANSACTION_SELECT,
        });
    },

    async getTransactionDeleteState(id: number) {
        return prisma.transaction.findUnique({
            where: { id },
            select: {
                _count: { select: { transactionItems: true } },
            },
        });
    },
};
