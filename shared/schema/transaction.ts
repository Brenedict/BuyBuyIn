// General Imports
import { z } from "zod";

// Local Imports
import { TransactionItemSchema } from "./transactionItem";

// ----------------------------- QUERY SCHEMAS --------------------------------------------

export const TransactionQuerySchema = z.object({
    status: z.enum(["VOID", "COMPLETE", "REFUNDED"]).optional(),
    paymentMethod: z.enum(["CASH", "ECASH", "CARD"]).optional(),
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(10),
});

// ----------------------------- CREATE SCHEMAS -------------------------------------------

export const TransactionFormCreateSchema = z.object({
    paymentMethod: z.enum(["CASH", "ECASH", "CARD"]),
    discount: z.number().min(0).default(0),
    items: z.array(TransactionItemSchema).min(1),
});

export const TransactionFormUpdateSchema = z.object({
    paymentMethod: z.enum(["CASH", "ECASH", "CARD"]).optional(),
    discount: z.number().min(0).optional(),
    status: z.enum(["VOID", "COMPLETE", "REFUNDED"]).optional(),
    items: z.array(TransactionItemSchema).optional(),
});

// ----------------------------- TYPES -----------------------------------------------------

export type TransactionQueryType = z.infer<typeof TransactionQuerySchema>;
export type TransactionFormCreateType = z.infer<typeof TransactionFormCreateSchema>;
export type TransactionFormUpdateType = z.infer<typeof TransactionFormUpdateSchema>;
