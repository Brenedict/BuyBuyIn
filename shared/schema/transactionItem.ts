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

// ----------------------------- TYPES -----------------------------------------------------

export type TransactionItemType = z.infer<typeof TransactionItemSchema>;
