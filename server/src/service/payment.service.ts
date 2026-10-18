import type { PaymentMethod, PaymentHandler } from "../types/paymentMethods";
import { z } from "zod";
import env from "../config/env.config";

const paymentStartResponseSchema = z.object({
    checkoutUrl: z.url(),
    reference: z.string().optional(),
});

const paymentStatusResponseSchema = z.object({
    status: z.enum(["pending", "paid", "failed", "expired"]),
});

export function cashHandler(getTenderedCents: () => number): PaymentHandler {
    return {
        async pay({ amountCents }) {
            const tendered = getTenderedCents();
            if (tendered < amountCents) return { status: "failed", method: "cash", reason: "Insufficient cash" };
            return { status: "success", method: "cash", changeCents: tendered - amountCents };
        },
    };
}

export function gatewayHandler(method: Exclude<PaymentMethod, "cash">): PaymentHandler {
    return {
        async pay({ orderId, amountCents }) {
            let res: Response;
            try {
                res = await fetch(new URL("/api/payments", env.PAYMENT_API_URL), {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ orderId, amountCents, method }),
                });
            } catch {
                return { status: "failed", method, reason: "Could not reach payment service" };
            }

            if (!res.ok) return { status: "failed", method, reason: "Could not start payment" };

            const parsedResponse = paymentStartResponseSchema.safeParse(await res.json());
            if (!parsedResponse.success) {
                return { status: "failed", method, reason: "Invalid payment service response" };
            }

            const { checkoutUrl, reference } = parsedResponse.data;
            return { status: "pending", method, reference: reference ?? orderId, checkoutUrl };
        },
    };
}

export async function waitForPayment(orderId: string, method: PaymentMethod, timeoutMs = 5 * 60_000) {
    const start = Date.now();
    while (Date.now() - start < timeoutMs) {
        let res: Response;
        try {
            res = await fetch(new URL(`/api/payments/${encodeURIComponent(orderId)}`, env.PAYMENT_API_URL));
        } catch {
            return { status: "failed", method, reason: "Could not reach payment service" } as const;
        }

        if (!res.ok) return { status: "failed", method, reason: "Could not check payment status" } as const;

        const parsedResponse = paymentStatusResponseSchema.safeParse(await res.json());
        if (!parsedResponse.success) {
            return { status: "failed", method, reason: "Invalid payment service response" } as const;
        }

        const { status } = parsedResponse.data;
        if (status === "paid") return { status: "success", method, reference: orderId } as const;
        if (status === "failed" || status === "expired") return { status: "failed", method, reason: status } as const;
        await new Promise((r) => setTimeout(r, 2000));
    }
    return { status: "failed", method, reason: "Timed out" } as const;
}
