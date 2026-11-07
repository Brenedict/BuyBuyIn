// General Imports
import { z } from "zod";
import { zfd } from "zod-form-data";

// BuyBuyin Shared Imports
import type { CatalogueProduct } from "./product";
import { queryNumberWithFallback } from "./preprocess";

// ----------------------------- QUERY SCHEMAS ---------------------------------------------

export const BranchWideOfferStatusSchema = z.enum(["ENABLED", "DISABLED", "DRAFT"]);
export const BranchWideOfferTypeSchema = z.enum(["OVERALL", "INDIVIDUAL"]);
export const BranchWideOfferDiscountTypeSchema = z.enum(["PERCENTAGE", "FIXED_VALUE"]);

export const BranchWideOfferQuerySchema = z.object({
    search: z.preprocess((value) => (value === "" || value === null ? undefined : value), z.string().trim().optional()),
    offerStatus: BranchWideOfferStatusSchema.optional(),
    offerType: BranchWideOfferTypeSchema.optional(),
    page: queryNumberWithFallback(z.number().int().min(1), 1),
    limit: queryNumberWithFallback(z.number().int().min(1).max(100), 10),
});

// ----------------------------- FORM SCHEMAS ----------------------------------------------

export const BranchWideOfferProductInputSchema = z.object({
    productId: z.number().int().positive(),
    unitDiscountValue: z.number().nonnegative(),
    requiredQuantity: z.number().int().positive(),
    discountType: BranchWideOfferDiscountTypeSchema,
});

const booleanFlag = z.preprocess((value) => {
    if (value === undefined || value === null || value === "") return false;
    if (typeof value === "string") return value === "true" || value === "on";
    return value;
}, z.boolean());

export const BranchWideOfferFormSchema = zfd
    .formData(
        z.object({
            offerName: zfd.text(z.string().trim().min(1).max(256)),
            description: zfd.text(z.string().trim().min(1)),
            startDate: zfd.text(z.iso.date()),
            endDate: zfd.text(z.iso.date()),
            offerStatus: zfd.text(BranchWideOfferStatusSchema).default("DRAFT"),
            offerType: zfd.text(BranchWideOfferTypeSchema),
            isExclusive: booleanFlag,
            discountType: zfd.text(BranchWideOfferDiscountTypeSchema).nullish(),
            overallDiscountValue: zfd.numeric(z.number().nonnegative()).nullish(),
            products: zfd.json(z.array(BranchWideOfferProductInputSchema)).default([]),
            branchIds: zfd.json(z.array(z.number().int().positive())).default([]),
        })
    )
    .superRefine((data, ctx) => {
        if (data.endDate < data.startDate) {
            ctx.addIssue({
                code: "custom",
                path: ["endDate"],
                message: "End date must be on or after the start date",
            });
        }

        const seenBranchIds = new Set<number>();

        data.branchIds.forEach((branchId, index) => {
            if (seenBranchIds.has(branchId)) {
                ctx.addIssue({
                    code: "custom",
                    path: ["branchIds", index],
                    message: "Duplicate branch in offer",
                });
            }

            seenBranchIds.add(branchId);
        });

        if (data.offerType === "OVERALL") {
            if (data.discountType === null || data.discountType === undefined || data.overallDiscountValue == null) {
                ctx.addIssue({
                    code: "custom",
                    path: ["overallDiscountValue"],
                    message: "Overall offers require a discount type and an overall discount value",
                });
            } else if (data.discountType === "PERCENTAGE" && data.overallDiscountValue > 100) {
                ctx.addIssue({
                    code: "custom",
                    path: ["overallDiscountValue"],
                    message: "Percentage discount cannot exceed 100",
                });
            }

            return;
        }

        if (data.products.length === 0) {
            ctx.addIssue({
                code: "custom",
                path: ["products"],
                message: "Individual offers require at least one product",
            });
        }

        const seenProductIds = new Set<number>();

        data.products.forEach((product, index) => {
            if (seenProductIds.has(product.productId)) {
                ctx.addIssue({
                    code: "custom",
                    path: ["products", index, "productId"],
                    message: "Duplicate product in offer",
                });
            }

            seenProductIds.add(product.productId);

            if (product.discountType === "PERCENTAGE" && product.unitDiscountValue > 100) {
                ctx.addIssue({
                    code: "custom",
                    path: ["products", index, "unitDiscountValue"],
                    message: "Percentage discount cannot exceed 100",
                });
            }
        });
    });

// ----------------------------- TYPES -----------------------------------------------------

export type BranchWideOfferQueryType = z.infer<typeof BranchWideOfferQuerySchema>;
export type BranchWideOfferFormType = z.infer<typeof BranchWideOfferFormSchema>;

// ----------------------------- RESPONSE TYPES --------------------------------------------

export type BranchWideOfferStatusType = z.infer<typeof BranchWideOfferStatusSchema>;
export type BranchWideOfferTypeType = z.infer<typeof BranchWideOfferTypeSchema>;
export type BranchWideOfferDiscountTypeType = z.infer<typeof BranchWideOfferDiscountTypeSchema>;

export type BranchWideOfferBranchEntry = { branchId: number; location: string };

export type BranchWideOfferProductEntry = {
    productId: number;
    productName: string;
    shelfPrice: number;
    unitDiscountValue: number;
    requiredQuantity: number;
    discountType: BranchWideOfferDiscountTypeType;
};

export type BranchWideOfferEntry = {
    id: number;
    offerName: string;
    description: string;
    startDate: string;
    endDate: string;
    isExclusive: boolean;
    offerStatus: BranchWideOfferStatusType;
    offerType: BranchWideOfferTypeType;
    discountType: BranchWideOfferDiscountTypeType | null;
    overallDiscountValue: number | null;
    branches: BranchWideOfferBranchEntry[];
    products: BranchWideOfferProductEntry[];
};

export type BranchWideOfferSummary = {
    totalOffers: number;
    activeOffers: number;
    inactiveOffers: number;
    totalBranches: number;
};

export type BranchWideOfferListResponse = {
    items: BranchWideOfferEntry[];
    summary: BranchWideOfferSummary;
    pagination: { page: number; limit: number; total: number; totalPages: number };
};

export type BranchWideOfferOptionsResponse = {
    products: CatalogueProduct[];
    branches: BranchWideOfferBranchEntry[];
};
