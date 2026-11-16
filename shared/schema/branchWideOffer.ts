// General Imports
import { z } from "zod";

// ----------------------------- QUERY SCHEMAS --------------------------------------------

export const BranchWideOfferQuerySchema = z.object({
    search: z.preprocess((value) => (value === "" || value === null ? undefined : value), z.string().trim().optional()),
    status: z.enum(["ENABLED", "DISABLED", "DRAFT"]).optional(),
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(10),
});

// ----------------------------- FORM SCHEMAS ----------------------------------------------

export const BranchWideOfferCreateSchema = z.object({
    offerName: z.string().trim().min(1).max(256),
    description: z.string().trim().min(1).max(1000),
    startDate: z.coerce.date(),
    endDate: z.coerce.date(),
    isExclusive: z.boolean(),
    offerStatus: z.enum(["ENABLED", "DISABLED", "DRAFT"]),
    offerType: z.enum(["OVERALL", "INDIVIDUAL"]),
    discountType: z.enum(["PERCENTAGE", "FIXEDVALUE"]),
    overallDiscountValue: z.number().nonnegative(),
});

export const BranchWideOfferUpdateSchema = z.object({
    offerName: z.string().trim().min(1).max(256).optional(),
    description: z.string().trim().min(1).max(1000).optional(),
    startDate: z.coerce.date().optional(),
    endDate: z.coerce.date().optional(),
    isExclusive: z.boolean().optional(),
    offerStatus: z.enum(["ENABLED", "DISABLED", "DRAFT"]).optional(),
    offerType: z.enum(["OVERALL", "INDIVIDUAL"]).optional(),
    discountType: z.enum(["PERCENTAGE", "FIXEDVALUE"]).optional(),
    overallDiscountValue: z.number().nonnegative().optional(),
});

// ----------------------------- TYPES -----------------------------------------------------

export type BranchWideOfferQueryType = z.infer<typeof BranchWideOfferQuerySchema>;
export type BranchWideOfferCreateType = z.infer<typeof BranchWideOfferCreateSchema>;
export type BranchWideOfferUpdateType = z.infer<typeof BranchWideOfferUpdateSchema>;
