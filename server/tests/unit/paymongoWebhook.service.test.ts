import { createHmac } from "node:crypto";
import { describe, expect, it } from "@jest/globals";
import { verifyPayMongoWebhookSignature } from "../../src/service/paymongoWebhook.service";

describe("verifyPayMongoWebhookSignature", () => {
    const secret = "whsk_test_secret";
    const timestamp = "1781900000";
    const rawBody = Buffer.from('{"data":{"id":"evt_test"}}');
    const signature = createHmac("sha256", secret).update(`${timestamp}.${rawBody.toString("utf8")}`).digest("hex");

    it("verifies the signature for the event's mode", () => {
        expect(
            verifyPayMongoWebhookSignature(rawBody, `t=${timestamp},te=${signature},li=`, secret, false)
        ).toBe(true);
    });

    it("uses the live signature for live events", () => {
        expect(
            verifyPayMongoWebhookSignature(rawBody, `t=${timestamp},te=,li=${signature}`, secret, true)
        ).toBe(true);
    });

    it("rejects modified payloads and missing secrets", () => {
        expect(
            verifyPayMongoWebhookSignature(Buffer.from(`${rawBody.toString("utf8")} `), `t=${timestamp},te=${signature}`, secret, false)
        ).toBe(false);
        expect(verifyPayMongoWebhookSignature(rawBody, `t=${timestamp},te=${signature}`, undefined, false, 1781900000)).toBe(false);
    });

});