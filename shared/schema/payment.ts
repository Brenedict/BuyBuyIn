import { z } from "zod";
import { zfd } from "zod-form-data";
import { TransactionUncheckedCreateInputObjectZodSchema } from "../zod/schemas";

export const TransactionSchema = zfd.formData(
    TransactionUncheckedCreateInputObjectZodSchema.omit({
    userID: true,
    totalPrice: true,
    dateofTransaction: true,
    paymentMethod: true,
    status: true,
    discount: true,
    paymentStatus: true,
    })
);

export type TransactionSchemaType = z.infer<typeof TransactionSchema>;

export const CreateCheckoutSchema = z.object({
    transactionId: z.number().int().positive(),
    method: z.enum(["ECASH", "CARD"]),
});

export type CreateCheckoutInput = z.infer<typeof CreateCheckoutSchema>;