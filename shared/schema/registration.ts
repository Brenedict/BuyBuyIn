// ==============================================================
/** Author: John Benedict Binas
 * Co-Authors: [Name]
 *
 * Description: This files defines all SCHEMAS (used in client and server sides) related to the account creation workflow.
 * (1) It includes SUPER ADMIN routes for creating new BUSINESS entities, and adding new SUBSCRIBER accounts (HQ ADMIN)
 * (2) It includes HQ ADMIN routes for creating new BRANCH entities, and adding new MANAGER accounts (BRANCH MANAGER)
 * (3) It includes BRANCH MANAGER routes for creating new CASHIER accounts.
 */
// ==============================================================

// General Imports
import { zfd } from "zod-form-data";
import z from "zod";
import {
    BusinessUncheckedCreateInputObjectZodSchema,
    UserUncheckedCreateInputObjectZodSchema,
    BranchUncheckedCreateInputObjectZodSchema,
} from "../zod/schemas";

export const BusinessEntityRegistrationSchema = zfd.formData(
    BusinessUncheckedCreateInputObjectZodSchema.omit({
        id: true,
    })
);

export type BusinessEntityRegistrationSchemaType = z.infer<typeof BusinessEntityRegistrationSchema>;

// HQ Admin, Branch Manager, and Cashier account registration schemas all share one schema since they are literally just one entity.
export const AccountRegistrationSchema = zfd.formData(
    UserUncheckedCreateInputObjectZodSchema.omit({
        id: true,
        password: true,
        role: true,
        createdAt: true,
        updatedAt: true,
        fullName: true,
        resetToken: true,
        resetTokenExpiresAt: true,
        accountStatus: true,
    })
);

export type AccountRegistrationSchemaType = z.infer<typeof AccountRegistrationSchema>;

export const BranchEntityRegistrationSchema = zfd.formData(
    BranchUncheckedCreateInputObjectZodSchema.omit({
        id: true,
    })
);

export type BranchEntityRegistrationSchemaType = z.infer<typeof BranchEntityRegistrationSchema>;
