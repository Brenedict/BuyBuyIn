import type { PaymentMethod, PaymentHandler } from "../types/paymentMethods";
import { z } from "zod";
import env from "../config/env.config";

const checkoutSessionResponseSchema = z.object({
    data: z.object({
        id: z.string(),
        attributes: z.object({ checkout_url: z.url() }),
    }),
});

interface CreateCheckoutSessionInput {
    transactionId: number;
    amountCents: number;
    method: "ECASH" | "CARD";
}

export async function createCheckoutSession({ transactionId, amountCents, method }: CreateCheckoutSessionInput) {
    const secretKey = env.PAYMONGO_SECRET_KEY;

    if (!secretKey) throw new Error("PAYMONGO_SECRET_KEY is not configured");
    if (!Number.isSafeInteger(amountCents) || amountCents <= 0) throw new Error("Invalid checkout amount");

    const response = await fetch("https://api.paymongo.com/v2/checkout_sessions", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Basic ${Buffer.from(`${secretKey}:`).toString("base64")}`,
        },
        body: JSON.stringify({
            data: {
                attributes: {
                    line_items: [
                        {
                            currency: "PHP",
                            amount: amountCents,
                            name: `Transaction ${transactionId}`,
                            quantity: 1,
                        },
                    ],
                    payment_method_types: method === "CARD" ? ["card"] : ["gcash", "paymaya"],
                    reference_number: String(transactionId),
                    success_url: `${env.FRONTEND_URL}/payment/return?transactionId=${transactionId}`,
                    cancel_url: `${env.FRONTEND_URL}/payment/cancel?transactionId=${transactionId}`,
                },
            },
        }),
    });

    if (!response.ok) throw new Error("PayMongo could not create the checkout session");

    const parsed = checkoutSessionResponseSchema.safeParse(await response.json());
    if (!parsed.success) throw new Error("PayMongo returned an invalid checkout response");

    return {
        sessionId: parsed.data.data.id,
        checkoutUrl: parsed.data.data.attributes.checkout_url,
    };
}

export function cashHandler(getTenderedCents: () => number): PaymentHandler {
    return {
        async pay({ amountCents }) {
            const tendered = getTenderedCents();
            if (tendered < amountCents) return { status: "failed", method: "cash", reason: "Insufficient cash" };
            return { status: "success", method: "cash", changeCents: tendered - amountCents };
        },
    };
}
