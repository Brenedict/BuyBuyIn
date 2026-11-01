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

export const BusinessEntityRegistrationSchema = zfd.formData(
    z.object({
        name: z.string().trim().min(1, "Business name cannot be empty").max(256),
        location: z.string().trim().min(1, "Location cannot be empty").max(256),
    })
);

export type BusinessEntityRegistrationSchemaType = z.infer<typeof BusinessEntityRegistrationSchema>;

// Update payload used when a SUPER ADMIN edits an existing Business (name + location only).
export const BusinessEntityUpdateSchema = zfd.formData(
    z.object({
        name: z.string().trim().min(1, "Business name cannot be empty").max(256),
        location: z.string().trim().min(1, "Location cannot be empty").max(256),
    })
);

export type BusinessEntityUpdateSchemaType = z.infer<typeof BusinessEntityUpdateSchema>;

// Update payload used when editing subscriber / manager / cashier account details.
// businessId is used when a subscriber is reassigned to another business; branchId for manager/cashier reassignment.
export const AccountUpdateSchema = zfd.formData(
    z.object({
        email: z.string().trim().min(1, "Email cannot be empty").max(256),
        firstName: z.string().trim().min(1, "First Name cannot be empty").max(256),
        lastName: z.string().trim().min(1, "Last Name cannot be empty").max(256),
        businessId: zfd.numeric(z.number().int().optional().nullable()),
        branchId: zfd.numeric(z.number().int().optional().nullable()),
    })
);

export type AccountUpdateSchemaType = z.infer<typeof AccountUpdateSchema>;

// Payload for the "Manage Account" radio popup action (deactivate or reactivate).
export const ManageAccountStatusSchema = zfd.formData(
    z.object({
        action: z.enum(["deactivate", "reactivate"], {
            message: "Invalid account action",
        }),
    })
);

export type ManageAccountStatusSchemaType = z.infer<typeof ManageAccountStatusSchema>;

// HQ Admin, Branch Manager, and Cashier account registration schemas all share one schema since they are literally just one entity.
// businessId / branchId are coerced because FormData values arrive as strings.
export const AccountRegistrationSchema = zfd.formData(
    z.object({
        email: z.string().trim().min(1, "Email cannot be empty").max(256),
        firstName: z.string().trim().min(1, "First Name cannot be empty").max(256),
        lastName: z.string().trim().min(1, "Last Name cannot be empty").max(256),

        // Registration Case 1: HQ Admin needs businessId provided, but no branchId
        // Registration Case 2: Branch Manager & Cashier needs branchId, businessId should be set by default
        businessId: zfd.numeric(z.number().int().optional().nullable()),
        branchId: zfd.numeric(z.number().int().optional().nullable()),
    })
);

export type AccountRegistrationSchemaType = z.infer<typeof AccountRegistrationSchema>;

// A branch entity is always attached to the creating HQ Admin's business, so no businessId is accepted from the client.
export const BranchEntityRegistrationSchema = zfd.formData(
    z.object({
        location: z.string().trim().min(1, "Location cannot be empty").max(256),
        accountLimit: zfd.numeric(z.number().int().min(1, "Account limit must be at least 1")),
    })
);

export type BranchEntityRegistrationSchemaType = z.infer<typeof BranchEntityRegistrationSchema>;

// Update payload used when an HQ ADMIN edits an existing Branch (location + account limit).
export const BranchEntityUpdateSchema = zfd.formData(
    z.object({
        location: z.string().trim().min(1, "Location cannot be empty").max(256),
        accountLimit: zfd.numeric(z.number().int().min(1, "Account limit must be at least 1")),
    })
);

export type BranchEntityUpdateSchemaType = z.infer<typeof BranchEntityUpdateSchema>;

// ----------------------------- RESPONSE TYPES --------------------------------------------

export type RegistrationBusinessEntry = {
    id: number;
    name: string;
    location: string;
};

export type RegistrationBranchEntry = {
    id: number;
    location: string;
    accountLimit: number;
    businessId: number | null;
};

export type RegistrationUserEntry = {
    id: number;
    email: string;
    firstName: string;
    lastName: string;
    fullName: string | null;
    role: string;
    accountStatus: string;
    businessId: number | null;
    branchId: number | null;
    business?: { id: number; name: string; location: string } | null;
    branch?: { id: number; location: string } | null;
};

// Payload for a delete-confirmation popup: the account being deleted plus the number of
// other accounts of the same role that remain linked to its parent entity (business / branch).
export type DeleteContextData = {
    account: RegistrationUserEntry;
    remainingCount: number;
};

// Payload for completing an account's registration (set password) via the emailed verification link.
export const CompleteAccountRegistrationSchema = zfd.formData(
    z
        .object({
            password: z.string().trim().min(8, "Password must be at least 8 characters."),
            confirmPassword: z.string().trim().min(8, "Password must be at least 8 characters."),
        })
        .refine(({ password, confirmPassword }) => password === confirmPassword, {
            message: "Passwords do not match.",
            path: ["confirmPassword"],
        })
);

export type CompleteAccountRegistrationSchemaType = z.infer<typeof CompleteAccountRegistrationSchema>;
