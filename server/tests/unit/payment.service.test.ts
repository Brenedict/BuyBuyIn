import { afterEach, beforeEach, describe, expect, it, jest } from "@jest/globals";
import env from "../../src/config/env.config";
import { createCheckoutSession } from "../../src/service/payment.service";

describe("createCheckoutSession", () => {
    const originalSecretKey = env.PAYMONGO_SECRET_KEY;
    let fetchMock: jest.SpiedFunction<typeof fetch>;

    beforeEach(() => {
        env.PAYMONGO_SECRET_KEY = "sk_test_mock_only";
        fetchMock = jest.spyOn(globalThis, "fetch");
    });

    afterEach(() => {
        fetchMock.mockRestore();
        env.PAYMONGO_SECRET_KEY = originalSecretKey;
    });

    it("creates a hosted checkout session using centavos and the secret key", async () => {
        fetchMock.mockResolvedValue(
            new Response(
                JSON.stringify({
                    data: {
                        id: "cs_test_example",
                        attributes: { checkout_url: "https://checkout.paymongo.com/test-example" },
                    },
                }),
                { status: 200 }
            )
        );

        await expect(
            createCheckoutSession({ transactionId: 123, amountCents: 12500, method: "ECASH" })
        ).resolves.toEqual({
            sessionId: "cs_test_example",
            checkoutUrl: "https://checkout.paymongo.com/test-example",
        });

        expect(fetchMock).toHaveBeenCalledTimes(1);
        const [url, request] = fetchMock.mock.calls[0];
        expect(url).toBe("https://api.paymongo.com/v2/checkout_sessions");
        expect(request?.method).toBe("POST");
        expect(request?.headers).toEqual({
            "Content-Type": "application/json",
            Authorization: `Basic ${Buffer.from("sk_test_mock_only:").toString("base64")}`,
        });
        expect(JSON.parse(String(request?.body))).toMatchObject({
            data: {
                attributes: {
                    line_items: [{ currency: "PHP", amount: 12500, quantity: 1 }],
                    payment_method_types: ["gcash", "paymaya"],
                    reference_number: "123",
                },
            },
        });
    });

    it("uses card as the selected payment method", async () => {
        fetchMock.mockResolvedValue(
            new Response(
                JSON.stringify({
                    data: {
                        id: "cs_test_card",
                        attributes: { checkout_url: "https://checkout.paymongo.com/test-card" },
                    },
                }),
                { status: 200 }
            )
        );

        await createCheckoutSession({ transactionId: 456, amountCents: 5000, method: "CARD" });

        const [, request] = fetchMock.mock.calls[0];
        expect(JSON.parse(String(request?.body)).data.attributes.payment_method_types).toEqual(["card"]);
    });

    it("rejects an invalid amount without calling PayMongo", async () => {
        await expect(
            createCheckoutSession({ transactionId: 123, amountCents: 0, method: "CARD" })
        ).rejects.toThrow("Invalid checkout amount");
        expect(fetchMock).not.toHaveBeenCalled();
    });

    it("rejects when the provider returns an error", async () => {
        fetchMock.mockResolvedValue(new Response("{}", { status: 500 }));

        await expect(
            createCheckoutSession({ transactionId: 123, amountCents: 12500, method: "CARD" })
        ).rejects.toThrow("PayMongo could not create the checkout session");
    });

    it("rejects a malformed provider response", async () => {
        fetchMock.mockResolvedValue(new Response(JSON.stringify({ data: { id: "missing-url" } }), { status: 200 }));

        await expect(
            createCheckoutSession({ transactionId: 123, amountCents: 12500, method: "CARD" })
        ).rejects.toThrow("PayMongo returned an invalid checkout response");
    });

    it("propagates network errors for the controller to handle", async () => {
        fetchMock.mockRejectedValue(new Error("Network unavailable"));

        await expect(
            createCheckoutSession({ transactionId: 123, amountCents: 12500, method: "CARD" })
        ).rejects.toThrow("Network unavailable");
    });

    it("requires a configured key before making a request", async () => {
        env.PAYMONGO_SECRET_KEY = undefined;

        await expect(
            createCheckoutSession({ transactionId: 123, amountCents: 12500, method: "CARD" })
        ).rejects.toThrow("PAYMONGO_SECRET_KEY is not configured");
        expect(fetchMock).not.toHaveBeenCalled();
    });
});