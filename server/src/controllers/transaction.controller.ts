// General Imports
import type { Request, Response } from "express";

// BuyBuyin Shared Imports
import { RoleType } from "@buybuyin/shared/prisma/enums";
import type { Transaction, User } from "@buybuyin/shared/prisma/browser";
import {
    TransactionFormCreateSchema,
    TransactionFormUpdateSchema,
    TransactionQuerySchema,
    type TransactionFormCreateType,
    type TransactionFormUpdateType,
    type TransactionQueryType,
} from "@buybuyin/shared/schema/transaction";

// Middlewares
import { jwtAccessAuth } from "../middlewares/passport.middleware";
import { requireAccessLevel } from "../middlewares/authorized.middleware";
import { validateSchema } from "../middlewares/zod.middleware";

// Services
import TransactionService from "../service/transaction.service";

export default {
    getTransactions: [
        jwtAccessAuth,
        requireAccessLevel(RoleType.CASHIER, "minimum"),
        validateSchema("query", TransactionQuerySchema),
        async (req: Request, res: Response) => {
            const query = req.query as unknown as TransactionQueryType;
            const catalogue = await TransactionService.getTransactions(req.user as User, query);

            return res.json(catalogue);
        },
    ],

    getTransaction: [
        jwtAccessAuth,
        requireAccessLevel(RoleType.CASHIER, "minimum"),
        async (req: Request, res: Response) => {
            const { transactionId } = req.params;

            if (isNaN(Number(transactionId))) return res.status(404).json({ error: "Transaction not found" });

            const transaction = await TransactionService.getTransaction(req.user as User, Number(transactionId));

            return res.json(transaction);
        },
    ],

    createTransaction: [
        jwtAccessAuth,
        requireAccessLevel(RoleType.CASHIER, "minimum"),
        validateSchema("body", TransactionFormCreateSchema),
        async (req: Request, res: Response) => {
            const input = req.body as unknown as TransactionFormCreateType;
            const transaction = await TransactionService.createTransaction(req.user as User, input);

            return res.status(201).json({ transaction, message: "Transaction created" });
        },
    ],

    updateTransaction: [
        jwtAccessAuth,
        requireAccessLevel(RoleType.BRANCHMANAGER, "minimum"),
        validateSchema("body", TransactionFormUpdateSchema),
        async (req: Request, res: Response) => {
            const input = req.body as unknown as TransactionFormUpdateType;
            const transaction = await TransactionService.updateTransaction(
                req.user as User,
                Number(req.params.transactionId),
                input
            );

            return res.json({ transaction, message: "Transaction updated" });
        },
    ],

    deleteTransaction: [
        jwtAccessAuth,
        requireAccessLevel(RoleType.BRANCHMANAGER, "minimum"),
        async (req: Request, res: Response) => {
            await TransactionService.deleteTransaction(req.user as User, Number(req.params.transactionId));

            return res.json({ message: "Transaction deleted" });
        },
    ],
};
