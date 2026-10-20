import { z } from "zod";

export const CreateCheckoutSchema = z.object({
    transactionId: z.number(),
    method: z.enum(["ECASH", "CARD"]),
});

export type CreateCheckoutInput = z.infer<typeof CreateCheckoutSchema>;