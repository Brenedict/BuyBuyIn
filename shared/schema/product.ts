// General Imports
import { z } from "zod";
import { zfd } from "zod-form-data";

// ----------------------------- QUERY SCHEMAS ---------------------------------------------

const queryNumber = (schema: z.ZodNumber) =>
    z.preprocess(
        (value) => (value === "" || value === null || value === undefined ? undefined : value),
        z.coerce.number().pipe(schema).optional()
    );

const queryNumberWithFallback = (schema: z.ZodNumber, fallback: number) =>
    z.preprocess(
        (value) => (value === "" || value === null || value === undefined ? fallback : value),
        z.coerce.number().pipe(schema)
    );

export const ProductQuerySchema = z.object({
    search: z.preprocess((value) => (value === "" || value === null ? undefined : value), z.string().trim().optional()),
    categoryId: queryNumber(z.number().int().positive()),
    supplierId: queryNumber(z.number().int().positive()),
    page: queryNumberWithFallback(z.number().int().min(1), 1),
    limit: queryNumberWithFallback(z.number().int().min(1).max(100), 10),
});

// ----------------------------- FORM SCHEMAS ----------------------------------------------

export const ProductFormCreateSchema = zfd.formData(
    z.object({
        productName: zfd.text(z.string().trim().min(1).max(256)),
        basePrice: zfd.numeric(z.number().nonnegative()),
        shelfPrice: zfd.numeric(z.number().nonnegative()),
        supplierId: zfd.numeric(z.number().int().positive()),
        categoryId: zfd.numeric(z.number().int().positive()),
    })
);

export const ProductFormUpdateSchema = zfd.formData(
    z.object({
        productName: zfd.text(z.string().trim().min(1).max(256)).optional(),
        basePrice: zfd.numeric(z.number().nonnegative()).optional(),
        shelfPrice: zfd.numeric(z.number().nonnegative()).optional(),
        supplierId: zfd.numeric(z.number().int().positive()).optional(),
        categoryId: zfd.numeric(z.number().int().positive()).optional(),
    })
);

// ----------------------------- TYPES -----------------------------------------------------

export type ProductQueryType = z.infer<typeof ProductQuerySchema>;
export type ProductFormCreateType = z.infer<typeof ProductFormCreateSchema>;
export type ProductFormUpdateType = z.infer<typeof ProductFormUpdateSchema>;

// ----------------------------- RESPONSE TYPES --------------------------------------------

export type CatalogueCategory = { id: number; categoryName: string };
export type CatalogueSupplier = { id: number; supplierName: string };

export type CatalogueProduct = {
    id: number;
    productName: string;
    basePrice: number;
    shelfPrice: number;
    category: CatalogueCategory | null;
    supplier: CatalogueSupplier | null;
};

export type CatalogueSummary = {
    totalProducts: number;
    totalCategories: number;
    totalSuppliers: number;
    averageShelfPrice: number;
};

export type CatalogueListResponse = {
    products: CatalogueProduct[];
    summary: CatalogueSummary;
    pagination: { page: number; limit: number; total: number; totalPages: number };
};

export type CatalogueOptionsResponse = {
    suppliers: CatalogueSupplier[];
    categories: CatalogueCategory[];
};
