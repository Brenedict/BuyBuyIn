import type { Request, Response } from "express";
import type { User } from "@buybuyin/shared/prisma/browser";
import prisma from "../config/prisma.config";
import { CreateCheckoutSchema, type CreateCheckoutInput } from "@buybuyin/shared/schema/payment";
import { jwtAccessAuth } from "../middlewares/passport.middleware";
import { validateSchema } from "../middlewares/zod.middleware";
import { createCheckoutSession } from "../service/payment.service";

export default {
    createCheckout: [
        jwtAccessAuth,
        validateSchema("body", CreateCheckoutSchema),
        async (req: Request, res: Response) => {
            const { transactionId, method } = req.body as CreateCheckoutInput;
            const cashier = req.user as User;

            const transaction = await prisma.transaction.findUnique({
                where: { id: transactionId },
            });

            if (!transaction) {
                return res.status(404).json({ error: "Transaction not found" });
            }
            if (transaction.userID !== String(cashier.id)) {
                return res.status(403).json({ error: "You cannot pay for this transaction" });
            }

            if (transaction.status === "VOID" || transaction.status === "COMPLETE") {
                return res.status(409).json({ error: "Transaction is not payable" });
            }

            if (transaction.paymentStatus === "PAID") {
                return res.status(409).json({ error: "Transaction is already paid" });
            }

            if (transaction.checkoutSessionId) {
                return res.status(409).json({ error: "A checkout session already exists" });
            }

            const amountCents = Math.round(transaction.totalPrice * 100);

            if (!Number.isSafeInteger(amountCents) || amountCents <= 0) {
                return res.status(400).json({ error: "Transaction amount is invalid" });
            }

            let checkout: Awaited<ReturnType<typeof createCheckoutSession>>;
            try {
                checkout = await createCheckoutSession({
                    transactionId: transaction.id,
                    amountCents,
                    method,
                });
            } catch {
                return res.status(502).json({ error: "Unable to start PayMongo checkout" });
            }

            await prisma.transaction.update({
                where: { id: transaction.id },
                data: {
                    paymentMethod: method,
                    paymentStatus: "PENDING",
                    checkoutSessionId: checkout.sessionId,
                },
            });

            return res.status(201).json({
                transactionId: transaction.id,
                paymentStatus: "PENDING",
                checkoutUrl: checkout.checkoutUrl,
            });
        },
    ],
};