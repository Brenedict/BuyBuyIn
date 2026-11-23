import type { User } from "@buybuyin/shared/prisma/browser";
import type {
    TransactionItemType,
    TransactionItemUpdateType,
} from "@buybuyin/shared/schema/transactionItem";
import TransactionItemModel, { TRANSACTION_ITEM_SELECT } from "../models/transactionItem.model";
import TransactionModel from "../models/transaction.model";
import prisma from "../config/prisma.config";
import { HttpError } from "../utils/error.util";

type Requestor = Pick<User, "id" | "role" | "businessId" | "branchId">;

const getTransaction = async (requestor: Requestor, transactionId: number) => {
    if (requestor.branchId === null || requestor.branchId === undefined) {
        throw new HttpError(403, "User is not attached to a branch");
    }

    const [transaction] = await TransactionModel.getTransactions({
        where: { id: transactionId, branchId: requestor.branchId },
        take: 1,
    });

    if (!transaction) {
        throw new HttpError(404, "Transaction not found");
    }

    return transaction;
};

const normalizeItem = (item: TransactionItemType) => {
    const hasProduct = item.productId !== undefined;
    const hasOffer = item.branchWideOfferId !== undefined;

    if (hasProduct === hasOffer) {
        throw new HttpError(400, "Each item must reference either a product or a branch-wide offer, not both.");
    }

    return {
        productId: item.productId ?? null,
        branchWideOfferId: item.branchWideOfferId ?? null,
        quantity: item.quantity,
        currentPrice: item.currentPrice,
        isBundle: item.isBundle,
    };
};

export default {
    async getTransactionItems(requestor: Requestor, transactionId: number) {
        await getTransaction(requestor, transactionId);
        return TransactionItemModel.getTransactionItems(transactionId);
    },

    async getTransactionItem(requestor: Requestor, transactionId: number, itemId: number) {
        await getTransaction(requestor, transactionId);
        const item = await TransactionItemModel.getTransactionItem(transactionId, itemId);

        if (!item) {
            throw new HttpError(404, "Transaction item not found");
        }

        return item;
    },

    async createTransactionItem(requestor: Requestor, transactionId: number, input: TransactionItemType) {
        const transaction = await getTransaction(requestor, transactionId);
        const data = normalizeItem(input);

        return prisma.$transaction(async (tx) => {
            const item = await tx.transactionItem.create({
                data: { ...data, transactionId },
                select: TRANSACTION_ITEM_SELECT,
            });
            const items = await tx.transactionItem.findMany({
                where: { transactionId },
                select: { quantity: true, currentPrice: true },
            });
            const subtotal = items.reduce((sum, current) => sum + current.currentPrice * current.quantity, 0);

            await tx.transaction.update({
                where: { id: transactionId },
                data: { totalPrice: Math.max(0, subtotal - (transaction.discount ?? 0)) },
            });

            return item;
        });
    },

    async updateTransactionItem(
        requestor: Requestor,
        transactionId: number,
        itemId: number,
        input: TransactionItemUpdateType
    ) {
        const transaction = await getTransaction(requestor, transactionId);
        const existing = await TransactionItemModel.getTransactionItem(transactionId, itemId);

        if (!existing) {
            throw new HttpError(404, "Transaction item not found");
        }

        const nextItem: TransactionItemType = {
            productId: input.productId ?? (input.branchWideOfferId !== undefined ? undefined : existing.productId ?? undefined),
            branchWideOfferId:
                input.branchWideOfferId ?? (input.productId !== undefined ? undefined : existing.branchWideOfferId ?? undefined),
            quantity: input.quantity ?? existing.quantity,
            currentPrice: input.currentPrice ?? existing.currentPrice,
            isBundle: input.isBundle ?? existing.isBundle,
        };
        const data = normalizeItem(nextItem);

        return prisma.$transaction(async (tx) => {
            const item = await tx.transactionItem.update({
                where: { id: itemId },
                data,
                select: TRANSACTION_ITEM_SELECT,
            });
            const items = await tx.transactionItem.findMany({
                where: { transactionId },
                select: { quantity: true, currentPrice: true },
            });
            const subtotal = items.reduce((sum, current) => sum + current.currentPrice * current.quantity, 0);

            await tx.transaction.update({
                where: { id: transactionId },
                data: { totalPrice: Math.max(0, subtotal - (transaction.discount ?? 0)) },
            });

            return item;
        });
    },

    async deleteTransactionItem(requestor: Requestor, transactionId: number, itemId: number): Promise<void> {
        const transaction = await getTransaction(requestor, transactionId);
        const existing = await TransactionItemModel.getTransactionItem(transactionId, itemId);

        if (!existing) {
            throw new HttpError(404, "Transaction item not found");
        }

        await prisma.$transaction(async (tx) => {
            await tx.transactionItem.delete({ where: { id: itemId } });
            const items = await tx.transactionItem.findMany({
                where: { transactionId },
                select: { quantity: true, currentPrice: true },
            });
            const subtotal = items.reduce((sum, current) => sum + current.currentPrice * current.quantity, 0);

            await tx.transaction.update({
                where: { id: transactionId },
                data: { totalPrice: Math.max(0, subtotal - (transaction.discount ?? 0)) },
            });
        });
    },
};