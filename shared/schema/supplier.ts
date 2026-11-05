// General Imports
import { z } from "zod";
import { zfd } from "zod-form-data";
import { queryNumberWithFallback } from "./preprocess";

// ----------------------------- QUERY SCHEMAS ---------------------------------------------

export const SupplierQuerySchema = z.object({
    search: z.preprocess((value) => (value === "" || value === null ? undefined : value), z.string().trim().optional()),
    page: queryNumberWithFallback(z.number().int().min(1), 1),
    limit: queryNumberWithFallback(z.number().int().min(1).max(100), 10),
});

// ----------------------------- FORM SCHEMAS ----------------------------------------------

export const SupplierFormCreateSchema = zfd.formData(
    z.object({
        supplierName: zfd.text(z.string().trim().min(1).max(256)),
        contactPerson: zfd.text(z.string().trim().min(1).max(256)),
        email: zfd.text(z.string().trim().email().max(256)),
        contactNumber: zfd.text(
            z
                .string()
                .trim()
                .regex(/^\d{11}$/)
        ),
        address: zfd.text(z.string().trim().min(1).max(256)),
    })
);

export const SupplierFormUpdateSchema = zfd.formData(
    z.object({
        supplierName: zfd.text(z.string().trim().min(1).max(256)).optional(),
        contactPerson: zfd.text(z.string().trim().min(1).max(256)).optional(),
        email: zfd.text(z.string().trim().email().max(256)).optional(),
        contactNumber: zfd
            .text(
                z
                    .string()
                    .trim()
                    .regex(/^\d{11}$/)
            )
            .optional(),
        address: zfd.text(z.string().trim().min(1).max(256)).optional(),
    })
);

// ----------------------------- TYPES -----------------------------------------------------

export type SupplierQueryType = z.infer<typeof SupplierQuerySchema>;
export type SupplierFormCreateType = z.infer<typeof SupplierFormCreateSchema>;
export type SupplierFormUpdateType = z.infer<typeof SupplierFormUpdateSchema>;

// ----------------------------- RESPONSE TYPES --------------------------------------------

export type SupplierEntry = {
    id: number;
    supplierName: string;
    contactPerson: string;
    email: string;
    contactNumber: string;
    address: string;
};

export type SupplierListResponse = {
    suppliers: SupplierEntry[];
    pagination: { page: number; limit: number; total: number; totalPages: number };
};
