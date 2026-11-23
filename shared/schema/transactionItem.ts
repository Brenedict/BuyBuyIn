// General Imports
import { z } from "zod";

// ----------------------------- ITEM SCHEMAS --------------------------------------------

export const TransactionItemSchema = z
    .object({
        productId: z.number().int().positive().optional(),
        branchWideOfferId: z.number().int().positive().optional(),
        quantity: z.number().int().positive(),
        currentPrice: z.number().nonnegative(),
        isBundle: z.boolean().default(false),
    })
    .refine(
        (item) => {
            const hasProduct = item.productId !== undefined;
            const hasOffer = item.branchWideOfferId !== undefined;
            return (hasProduct && !hasOffer) || (!hasProduct && hasOffer);
        },
        {
            message: "Each transaction item must reference either a product or a branch-wide offer, but not both.",
            path: ["productId"],
        }
    );

export const TransactionItemUpdateSchema = z
    .object({
        productId: z.number().int().positive().optional(),
        branchWideOfferId: z.number().int().positive().optional(),
        quantity: z.number().int().positive().optional(),
        currentPrice: z.number().nonnegative().optional(),
        isBundle: z.boolean().optional(),
    })
    .refine((item) => !(item.productId !== undefined && item.branchWideOfferId !== undefined), {
        message: "A transaction item cannot reference both a product and a branch-wide offer.",
        path: ["productId"],
    })
    .refine((item) => Object.keys(item).length > 0, {
        message: "At least one transaction item field must be provided.",
    });

// ----------------------------- TYPES -----------------------------------------------------

export type TransactionItemType = z.infer<typeof TransactionItemSchema>;
export type TransactionItemUpdateType = z.infer<typeof TransactionItemUpdateSchema>;
