import type { Request, Response } from "express";
import type { User } from "@buybuyin/shared/prisma/browser";
import prisma from "../config/prisma.config";
import { CreateCheckoutSchema, type CreateCheckoutInput } from "@buybuyin/shared/schema/payment";
import { jwtAccessAuth } from "../middlewares/passport.middleware";
import { validateSchema } from "../middlewares/zod.middleware";
import { createCheckoutSession } from "../service/payment.service";
import { verifyPayMongoWebhookSignature } from "../service/paymongoWebhook.service";
import env from "../config/env.config";
import { z } from "zod";

const webhookEventSchema = z.object({
    data: z.object({
        attributes: z.object({
            type: z.string(),
            livemode: z.boolean(),
            data: z.object({
                id: z.string(),
                attributes: z.object({
                    payments: z.array(
                        z.object({
                            attributes: z.object({
                                amount: z.number(),
                                currency: z.string(),
                                status: z.string(),
                            }),
                        })
                    ).optional(),
                }),
            }),
        }),
    }),
});

export default {
    handleWebhook: async (req: Request, res: Response) => {
        const rawBody = (req as Request & { rawBody?: Buffer }).rawBody;
        if (!rawBody || !env.PAYMONGO_WEBHOOK_SECRET) {
            return res.status(503).json({ error: "Payment webhook is not configured" });
        }

        let body: unknown;
        try {
            body = JSON.parse(rawBody.toString("utf8"));
        } catch {
            return res.status(400).json({ error: "Invalid webhook payload" });
        }

        const parsed = webhookEventSchema.safeParse(body);
        if (!parsed.success) {
            return res.status(400).json({ error: "Invalid webhook payload" });
        }

        const event = parsed.data.data.attributes;
        if (
            !verifyPayMongoWebhookSignature(
                rawBody,
                req.get("paymongo-signature"),
                env.PAYMONGO_WEBHOOK_SECRET,
                event.livemode
            )
        ) {
            return res.status(401).json({ error: "Invalid webhook signature" });
        }

        if (event.type !== "checkout_session.payment.paid") {
            return res.status(200).json({ received: true, ignored: true });
        }

        const paidPayment = event.data.attributes.payments?.find(
            (payment) => payment.attributes.status === "paid"
        );
        if (!paidPayment || paidPayment.attributes.currency.toUpperCase() !== "PHP") {
            return res.status(400).json({ error: "Paid checkout details are missing or invalid" });
        }

        const transaction = await prisma.transaction.findFirst({
            where: { checkoutSessionId: event.data.id },
        });
        if (!transaction) {
            return res.status(404).json({ error: "Checkout session not found" });
        }

        const expectedAmount = Math.round(transaction.totalPrice * 100);
        if (paidPayment.attributes.amount !== expectedAmount) {
            return res.status(400).json({ error: "Paid amount does not match the transaction" });
        }

        if (transaction.paymentStatus === "PAID") {
            return res.status(200).json({ received: true, duplicate: true });
        }
        if (transaction.paymentStatus !== "PENDING") {
            return res.status(200).json({ received: true, ignored: true });
        }

        await prisma.transaction.updateMany({
            where: { id: transaction.id, paymentStatus: "PENDING" },
            data: {
                paymentStatus: "PAID",
                ...(transaction.status === "VOID" || transaction.status === "REFUNDED" ? {} : { status: "COMPLETE" }),
            },
        });

        return res.status(200).json({ received: true });
    },
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