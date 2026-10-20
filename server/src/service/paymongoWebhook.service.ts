import { createHmac, timingSafeEqual } from "node:crypto";

export function verifyPayMongoWebhookSignature(
    rawBody: Buffer,
    signatureHeader: string | undefined,
    secret: string | undefined,
    livemode: boolean
) {
    if (!secret || !signatureHeader) return false;

    const fields = new Map(
        signatureHeader.split(",").map((part) => {
            const separator = part.indexOf("=");
            return separator < 0 ? ["", ""] : [part.slice(0, separator).trim(), part.slice(separator + 1).trim()];
        })
    );
    const timestamp = fields.get("t");
    const signature = fields.get(livemode ? "li" : "te");
    if (!timestamp || !/^\d+$/.test(timestamp) || !signature || !/^[a-f\d]{64}$/i.test(signature)) {
        return false;
    }

    const expected = createHmac("sha256", secret).update(`${timestamp}.${rawBody.toString("utf8")}`).digest();
    const received = Buffer.from(signature, "hex");

    return received.length === expected.length && timingSafeEqual(received, expected);
}