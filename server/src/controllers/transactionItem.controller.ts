import type { Request, Response } from "express";
import { RoleType } from "@buybuyin/shared/prisma/enums";
import type { User } from "@buybuyin/shared/prisma/browser";
import {
    TransactionItemSchema,
    TransactionItemUpdateSchema,
    type TransactionItemType,
    type TransactionItemUpdateType,
} from "@buybuyin/shared/schema/transactionItem";
import { jwtAccessAuth } from "../middlewares/passport.middleware";
import { requireAccessLevel } from "../middlewares/authorized.middleware";
import { validateSchema } from "../middlewares/zod.middleware";
import TransactionItemService from "../service/transactionItem.service";

const getIds = (req: Request, res: Response) => {
    const transactionId = Number(req.params.transactionId);
    const itemId = req.params.itemId === undefined ? undefined : Number(req.params.itemId);

    if (!Number.isInteger(transactionId) || transactionId <= 0 || (itemId !== undefined && (!Number.isInteger(itemId) || itemId <= 0))) {
        res.status(404).json({ error: "Transaction item not found" });
        return undefined;
    }

    return { transactionId, itemId };
};

export default {
    getTransactionItems: [
        jwtAccessAuth,
        requireAccessLevel(RoleType.CASHIER, "minimum"),
        async (req: Request, res: Response) => {
            const ids = getIds(req, res);
            if (!ids) return;
            const items = await TransactionItemService.getTransactionItems(req.user as User, ids.transactionId);
            return res.json(items);
        },
    ],

    getTransactionItem: [
        jwtAccessAuth,
        requireAccessLevel(RoleType.CASHIER, "minimum"),
        async (req: Request, res: Response) => {
            const ids = getIds(req, res);
            if (!ids || ids.itemId === undefined) return;
            const item = await TransactionItemService.getTransactionItem(req.user as User, ids.transactionId, ids.itemId);
            return res.json(item);
        },
    ],

    createTransactionItem: [
        jwtAccessAuth,
        requireAccessLevel(RoleType.CASHIER, "minimum"),
        validateSchema("body", TransactionItemSchema),
        async (req: Request, res: Response) => {
            const ids = getIds(req, res);
            if (!ids) return;
            const input = req.body as TransactionItemType;
            const item = await TransactionItemService.createTransactionItem(req.user as User, ids.transactionId, input);
            return res.status(201).json({ transactionItem: item, message: "Transaction item created" });
        },
    ],

    updateTransactionItem: [
        jwtAccessAuth,
        requireAccessLevel(RoleType.BRANCHMANAGER, "minimum"),
        validateSchema("body", TransactionItemUpdateSchema),
        async (req: Request, res: Response) => {
            const ids = getIds(req, res);
            if (!ids || ids.itemId === undefined) return;
            const input = req.body as TransactionItemUpdateType;
            const item = await TransactionItemService.updateTransactionItem(
                req.user as User,
                ids.transactionId,
                ids.itemId,
                input
            );
            return res.json({ transactionItem: item, message: "Transaction item updated" });
        },
    ],

    deleteTransactionItem: [
        jwtAccessAuth,
        requireAccessLevel(RoleType.BRANCHMANAGER, "minimum"),
        async (req: Request, res: Response) => {
            const ids = getIds(req, res);
            if (!ids || ids.itemId === undefined) return;
            await TransactionItemService.deleteTransactionItem(req.user as User, ids.transactionId, ids.itemId);
            return res.json({ message: "Transaction item deleted" });
        },
    ],
};