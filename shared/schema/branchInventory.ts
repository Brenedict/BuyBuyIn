// General Imports
import { z } from "zod";
import { zfd } from "zod-form-data";

// BuyBuyin Shared Imports
import type { CatalogueProduct } from "./product";
import { queryNumber, queryNumberWithFallback } from "./preprocess";

// ----------------------------- QUERY SCHEMAS ---------------------------------------------

export const BranchInventoryStatusSchema = z.enum(["in-stock", "low-stock", "out-of-stock"]);

export const BranchInventoryQuerySchema = z.object({
    search: z.preprocess((value) => (value === "" || value === null ? undefined : value), z.string().trim().optional()),
    categoryId: queryNumber(z.number().int().positive()),
    supplierId: queryNumber(z.number().int().positive()),
    status: BranchInventoryStatusSchema.optional(),
    page: queryNumberWithFallback(z.number().int().min(1), 1),
    limit: queryNumberWithFallback(z.number().int().min(1).max(100), 10),
});

// ----------------------------- FORM SCHEMAS ----------------------------------------------

export const BranchInventoryFormCreateSchema = zfd.formData(
    z.object({
        productId: zfd.numeric(z.number().int().positive()),
        quantity: zfd.numeric(z.number().int().nonnegative()),
        reorderThreshold: zfd.numeric(z.number().int().nonnegative()),
    })
);

export const BranchInventoryFormRestockSchema = zfd.formData(
    z.object({
        quantity: zfd.numeric(z.number().int().positive()),
        reorderThreshold: zfd.numeric(z.number().int().nonnegative()).optional(),
    })
);

// ----------------------------- TYPES -----------------------------------------------------

export type BranchInventoryStatusType = "IN_STOCK" | "LOW_STOCK" | "OUT_OF_STOCK";

// NOTE: Example format nito is SKU-0001
export type BranchInventoryProduct = CatalogueProduct & { sku: string };

export type BranchInventoryEntry = {
    id: number;
    product: BranchInventoryProduct;
    quantity: number;
    reorderThreshold: number;
    unitPrice: number; // shelfPrice
    stockValue: number; // quantity * shelfPrice
    status: BranchInventoryStatusType;
};

export type BranchInventorySummary = {
    totalItems: number;
    totalCategories: number;
    totalStockValue: number;
    lowStockCount: number;
    outOfStockCount: number;
};

export type BranchInventoryListResponse = {
    items: BranchInventoryEntry[];
    summary: BranchInventorySummary;
    pagination: { page: number; limit: number; total: number; totalPages: number };
};

export type BranchInventoryOptionsResponse = { products: CatalogueProduct[] };

export type BranchInventoryQueryType = z.infer<typeof BranchInventoryQuerySchema>;
export type BranchInventoryFormCreateType = z.infer<typeof BranchInventoryFormCreateSchema>;
export type BranchInventoryFormRestockType = z.infer<typeof BranchInventoryFormRestockSchema>;
