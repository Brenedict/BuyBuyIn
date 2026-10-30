// ==============================================================
/** Author: John Benedict Binas
 * Co-Authors: [Name]
 *
 * Description: Handles the client-side account registration / verification flow.
 * (1) Validates the emailed access token via the account verification loader.
 * (2) Completes the account registration by setting the new password via the action.
 */
// ==============================================================

// General Imports
import { redirect, type ActionFunctionArgs, type LoaderFunctionArgs } from "react-router";
import { ROUTES } from "../routes/Routes";
import {
    AccountRegistrationSchema,
    BranchEntityRegistrationSchema,
    BusinessEntityRegistrationSchema,
    CompleteAccountRegistrationSchema,
    type RegistrationBranchEntry,
    type RegistrationBusinessEntry,
    type RegistrationUserEntry,
} from "@buybuyin/shared/schema/registration";

// API Services
import {
    apiJson,
    ensureOk,
    ensureOkOrRedirect,
    handleErrRedirect,
    redirectWithQuery,
    validateForm,
} from "./actionService";
import { apiFetch } from "./httpClient";

const FALLBACK_ERROR = "Something went wrong. Please try again.";

export interface AccountVerificationLoaderData {
    email: string;
    isTokenExpired: boolean;
    message: string;
}

// Validates the emailed access token and returns the masked email of the account being verified.
// This uses the same resetToken attribute from the User table.
export const checkAccountRegistrationToken = async ({ request }: LoaderFunctionArgs) => {
    try {
        // Create URL object for query extraction
        const url = new URL(request.url);

        // Extract the 'token' query parameter
        const token = url.searchParams.get("token") ?? "";

        // Initial check for token length, prevents wasteful query on fake tokens
        if (token.trim().length === 0 || token.trim().length <= 63) {
            throw redirect(ROUTES.AUTH);
        }

        const res = await apiFetch(`/registration/verify-email?token=${token}`, { method: "GET" });

        const result = await res.json().catch(() => null);

        const isTokenExpired = res.status >= 400;

        return {
            email: res.ok ? (result?.email ?? "") : "",
            isTokenExpired,
            message: res.ok ? "" : (result?.message ?? FALLBACK_ERROR),
        };
    } catch {
        throw redirect(ROUTES.AUTH);
    }
};

export interface AccountVerificationActionData {
    error: string;
}

// Completes the account registration by setting the user's chosen password.
export const completeAccountRegistration = async ({ request }: ActionFunctionArgs) => {
    // Create URL object for query extraction
    const url = new URL(request.url);

    // Extract the 'token' query parameter
    const token = url.searchParams.get("token") ?? "";

    if (token.trim().length <= 63) {
        return { error: "Invalid or missing verification link." };
    }

    // Validate the submitted passwords before hitting the server
    const formData = await request.formData();
    const result = CompleteAccountRegistrationSchema.safeParse(formData);

    if (!result.success) {
        const firstIssue = result.error.issues[0];
        return { error: firstIssue?.message ?? "Invalid form submission." };
    }

    const res = await apiFetch(`/registration/complete-account?token=${token}`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(result.data),
    });

    if (res.ok) {
        return redirect(ROUTES.AUTH);
    }

    const apiError = await res.json().catch(() => null);
    const message = apiError?.message ?? apiError?.error ?? FALLBACK_ERROR;

    return { error: typeof message === "string" ? message : FALLBACK_ERROR };
};

// GET: Fetches all businesses (for the businesses tab + subscriber form options)
export const getBusinesses = async ({ request }: LoaderFunctionArgs): Promise<RegistrationBusinessEntry[]> => {
    try {
        const res = await apiJson("/registration/businesses", { method: "GET" });

        await ensureOk(res, "Failed to retrieve businesses");

        return res.json();
    } catch (err) {
        throw handleErrRedirect(err, request, ROUTES.SUPER_ADMIN.businesses);
    }
};

// GET: Fetches branches scoped to the requestor's business (for manager / cashier form options)
export const getBranches = async ({ request }: LoaderFunctionArgs): Promise<RegistrationBranchEntry[]> => {
    try {
        const res = await apiJson("/registration/branches", { method: "GET" });

        await ensureOk(res, "Failed to retrieve branches");

        return res.json();
    } catch (err) {
        throw handleErrRedirect(err, request, ROUTES.HQ_ADMIN.manageUsers);
    }
};

// GET: Fetches subscriber (HQ Admin) accounts
export const getSubscribers = async ({ request }: LoaderFunctionArgs): Promise<RegistrationUserEntry[]> => {
    try {
        const res = await apiJson("/registration/subscribers", { method: "GET" });

        await ensureOk(res, "Failed to retrieve subscriber accounts");

        return res.json();
    } catch (err) {
        throw handleErrRedirect(err, request, ROUTES.SUPER_ADMIN.subscriberAccounts);
    }
};

// GET: Fetches branch manager accounts
export const getManagers = async ({ request }: LoaderFunctionArgs): Promise<RegistrationUserEntry[]> => {
    try {
        const res = await apiJson("/registration/managers", { method: "GET" });

        await ensureOk(res, "Failed to retrieve managers");

        return res.json();
    } catch (err) {
        throw handleErrRedirect(err, request, ROUTES.HQ_ADMIN.manageUsers);
    }
};

export interface ManageUsersPageData {
    branches: RegistrationBranchEntry[];
    managers: RegistrationUserEntry[];
}

// GET: Fetches the HQ Manage Users page data (branches + managers) in parallel
export const getManageUsersPage = async (args: LoaderFunctionArgs): Promise<ManageUsersPageData> => {
    try {
        const [branches, managers] = await Promise.all([getBranches(args), getManagers(args)]);

        return { branches, managers };
    } catch (err) {
        throw handleErrRedirect(err, args.request, ROUTES.HQ_ADMIN.manageUsers);
    }
};

// GET: Fetches cashier accounts
export const getCashiers = async ({ request }: LoaderFunctionArgs): Promise<RegistrationUserEntry[]> => {
    try {
        const res = await apiJson("/registration/cashiers", { method: "GET" });

        await ensureOk(res, "Failed to retrieve cashiers");

        return res.json();
    } catch (err) {
        throw handleErrRedirect(err, request, ROUTES.BRANCH_MANAGER.manageUsers);
    }
};

// POST: Creates a HQ Admin Account
export const createUserHqAdmin = async ({ request }: ActionFunctionArgs) => {
    try {
        const formData = await request.formData();

        // ZOD Schema Checking
        const user = validateForm(formData, AccountRegistrationSchema, "Invalid user data");

        // Main Fetch Request
        const res = await apiJson("/registration/subscriber-account", { method: "POST", body: JSON.stringify(user) });

        await ensureOkOrRedirect(res, "Failed to create user", request, ROUTES.SUPER_ADMIN.subscriberAccounts);

        return redirectWithQuery(request, ROUTES.SUPER_ADMIN.subscriberAccounts, "NOTIF=Subscriber successfully added");
    } catch (err) {
        return handleErrRedirect(err, request, ROUTES.SUPER_ADMIN.subscriberAccounts);
    }
};

// POST: Creates a Business Entity
export const createBusinessEntity = async ({ request }: ActionFunctionArgs) => {
    try {
        const formData = await request.formData();

        // ZOD Schema Checking
        const business = validateForm(formData, BusinessEntityRegistrationSchema, "Invalid business data");

        // Main Fetch Request
        const res = await apiJson("/registration/business-entity", { method: "POST", body: JSON.stringify(business) });

        await ensureOkOrRedirect(res, "Failed to create business", request, ROUTES.SUPER_ADMIN.businesses);

        return redirectWithQuery(request, ROUTES.SUPER_ADMIN.businesses, "NOTIF=Business successfully added");
    } catch (err) {
        return handleErrRedirect(err, request, ROUTES.SUPER_ADMIN.businesses);
    }
};

// POST: Creates a Branch Entity
export const createBranchEntity = async ({ request }: ActionFunctionArgs) => {
    try {
        const formData = await request.formData();

        // ZOD Schema Checking
        const branch = validateForm(formData, BranchEntityRegistrationSchema, "Invalid branch data");

        // Main Fetch Request
        const res = await apiJson("/registration/branch-entity", { method: "POST", body: JSON.stringify(branch) });

        await ensureOkOrRedirect(res, "Failed to create branch", request, ROUTES.HQ_ADMIN.manageUsers);

        return redirectWithQuery(request, ROUTES.HQ_ADMIN.manageUsers, "NOTIF=Branch successfully added");
    } catch (err) {
        return handleErrRedirect(err, request, ROUTES.HQ_ADMIN.manageUsers);
    }
};

// POST: Creates a Branch Manager Account
export const createBranchManagerAccount = async ({ request }: ActionFunctionArgs) => {
    try {
        const formData = await request.formData();

        // ZOD Schema Checking
        const user = validateForm(formData, AccountRegistrationSchema, "Invalid user data");

        // Main Fetch Request
        const res = await apiJson("/registration/manager-account", { method: "POST", body: JSON.stringify(user) });

        await ensureOkOrRedirect(res, "Failed to create manager", request, ROUTES.HQ_ADMIN.manageUsers);

        return redirectWithQuery(request, ROUTES.HQ_ADMIN.manageUsers, "NOTIF=Manager successfully added");
    } catch (err) {
        return handleErrRedirect(err, request, ROUTES.HQ_ADMIN.manageUsers);
    }
};

// POST: Creates a Cashier Account
export const createCashierAccount = async ({ request }: ActionFunctionArgs) => {
    try {
        const formData = await request.formData();

        // ZOD Schema Checking
        const user = validateForm(formData, AccountRegistrationSchema, "Invalid user data");

        // Main Fetch Request
        const res = await apiJson("/registration/cashier-account", { method: "POST", body: JSON.stringify(user) });

        await ensureOkOrRedirect(res, "Failed to create user", request, ROUTES.BRANCH_MANAGER.manageUsers);

        return redirectWithQuery(request, ROUTES.BRANCH_MANAGER.manageUsers, "NOTIF=User successfully added");
    } catch (err) {
        return handleErrRedirect(err, request, ROUTES.BRANCH_MANAGER.manageUsers);
    }
};
