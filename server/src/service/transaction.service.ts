// General Imports
import type {
    TransactionUncheckedUpdateInput,
    TransactionUpdateInput,
    TransactionWhereInput,
} from "@buybuyin/shared/prisma/models";
import type { User } from "@buybuyin/shared/prisma/browser";
import type {
    TransactionFormCreateType,
    TransactionFormUpdateType,
    TransactionQueryType,
} from "@buybuyin/shared/schema/transaction";

// Models
import TransactionModel, { TRANSACTION_SELECT } from "../models/transaction.model";

// Prisma config
import prisma from "../config/prisma.config";

// Utils
import { HttpError } from "../utils/error.util";

// ----------------------------- TYPES -----------------------------------------------------

type Requestor = Pick<User, "id" | "role" | "businessId" | "branchId">;
type TransactionRow = NonNullable<Awaited<ReturnType<typeof TransactionModel.getTransactionById>>>;

// ----------------------------- PRIVATE FUNCTIONS -----------------------------------------

const resolveBranchId = (requestor: Requestor): number => {
    if (requestor.branchId === null || requestor.branchId === undefined) {
        throw new HttpError(403, "User is not attached to a branch");
    }

    return requestor.branchId;
};

const normalizeTransactionItems = (items: TransactionFormCreateType["items"]) => {
    return items.map((item) => {
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
    });
};

// ----------------------------- PUBLIC FUNCTIONS ------------------------------------------

export default {
    resolveBranchId,

    async getTransactions(requestor: Requestor, query: TransactionQueryType) {
        const branchId = resolveBranchId(requestor);
        const { status, paymentMethod, page, limit } = query;

        const where: TransactionWhereInput = {
            branchId,
            ...(status && { status }),
            ...(paymentMethod && { paymentMethod }),
        };

        const [transactions, total] = await Promise.all([
            TransactionModel.getTransactions({
                where,
                skip: (page - 1) * limit,
                take: limit,
                orderBy: { dateofTransaction: "desc" },
            }),
            TransactionModel.count({ where }),
        ]);

        return {
            transactions,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.max(1, Math.ceil(total / limit)),
            },
        };
    },

    async getTransaction(requestor: Requestor, transactionId: number): Promise<TransactionRow> {
        const branchId = resolveBranchId(requestor);

        const [transaction] = await TransactionModel.getTransactions({
            where: { id: transactionId, branchId },
            take: 1,
        });

        if (!transaction) {
            throw new HttpError(404, "Transaction not found");
        }

        return transaction;
    },

    async createTransaction(requestor: Requestor, input: TransactionFormCreateType): Promise<TransactionRow> {
        const branchId = resolveBranchId(requestor);
        const normalizedItems = normalizeTransactionItems(input.items);

        const subtotal = normalizedItems.reduce((sum, item) => sum + item.currentPrice * item.quantity, 0);
        const totalPrice = Math.max(0, subtotal - (input.discount ?? 0));

        const transaction = await prisma.$transaction(async (tx) => {
            const created = await tx.transaction.create({
                data: {
                    totalPrice,
                    dateofTransaction: new Date(),
                    paymentMethod: input.paymentMethod,
                    status: "COMPLETE",
                    discount: input.discount ?? 0,
                    branchId,
                    userId: requestor.id,
                },
                select: TRANSACTION_SELECT,
            });

            await tx.transactionItem.createMany({
                data: normalizedItems.map((item) => ({
                    transactionId: created.id,
                    productId: item.productId,
                    branchWideOfferId: item.branchWideOfferId,
                    quantity: item.quantity,
                    currentPrice: item.currentPrice,
                    isBundle: item.isBundle,
                })),
            });

            return tx.transaction.findUnique({
                where: { id: created.id },
                select: TRANSACTION_SELECT,
            });
        });

        if (!transaction) {
            throw new HttpError(500, "Failed to create transaction");
        }

        return transaction;
    },

    async updateTransaction(
        requestor: Requestor,
        transactionId: number,
        input: TransactionFormUpdateType
    ): Promise<TransactionRow> {
        const branchId = resolveBranchId(requestor);

        const [existing] = await TransactionModel.getTransactions({
            where: { id: transactionId, branchId },
            take: 1,
        });

        if (!existing) {
            throw new HttpError(404, "Transaction not found");
        }

        const { items, ...fields } = input;
        const data: TransactionUpdateInput = { ...fields };

        const updated = await prisma.$transaction(async (tx) => {
            let nextTransaction = existing;

            if (Object.keys(fields).length > 0) {
                nextTransaction = await tx.transaction.update({
                    where: { id: transactionId },
                    data,
                    select: TRANSACTION_SELECT,
                });
            }

            if (items && items.length > 0) {
                const normalizedItems = normalizeTransactionItems(items);

                await tx.transactionItem.deleteMany({ where: { transactionId } });

                await tx.transactionItem.createMany({
                    data: normalizedItems.map((item) => ({
                        transactionId,
                        productId: item.productId,
                        branchWideOfferId: item.branchWideOfferId,
                        quantity: item.quantity,
                        currentPrice: item.currentPrice,
                        isBundle: item.isBundle,
                    })),
                });

                const subtotal = normalizedItems.reduce((sum, item) => sum + item.currentPrice * item.quantity, 0);
                const discountValue = typeof data.discount === "number" ? data.discount : existing.discount ?? 0;
                const totalPrice = Math.max(0, subtotal - discountValue);

                nextTransaction = await tx.transaction.update({
                    where: { id: transactionId },
                    data: {
                        totalPrice,
                        discount: discountValue,
                    },
                    select: TRANSACTION_SELECT,
                });
            }

            return nextTransaction;
        });

        return updated;
    },

    async deleteTransaction(requestor: Requestor, transactionId: number): Promise<void> {
        const branchId = resolveBranchId(requestor);

        const [existing] = await TransactionModel.getTransactions({
            where: { id: transactionId, branchId },
            take: 1,
        });

        if (!existing) {
            throw new HttpError(404, "Transaction not found");
        }

        await prisma.$transaction([
            prisma.transactionItem.deleteMany({ where: { transactionId } }),
            prisma.transaction.delete({ where: { id: transactionId } }),
        ]);
    },
}