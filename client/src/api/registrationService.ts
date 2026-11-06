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
    AccountUpdateSchema,
    BranchEntityRegistrationSchema,
    BranchEntityUpdateSchema,
    BusinessEntityRegistrationSchema,
    BusinessEntityUpdateSchema,
    CompleteAccountRegistrationSchema,
    ManageAccountStatusSchema,
    type DeleteContextData,
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

const parseRegistrationId = (id: string | undefined): number | null => {
    const parsed = Number(id);

    return Number.isInteger(parsed) && parsed > 0 ? parsed : null;
};

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

export type SubscriberFormLoaderData = {
    subscriber: RegistrationUserEntry | null;
    businesses: RegistrationBusinessEntry[];
};

export type ManagerFormLoaderData = {
    manager: RegistrationUserEntry | null;
    branches: RegistrationBranchEntry[];
};

export type CashierFormLoaderData = {
    cashier: RegistrationUserEntry | null;
    branches: RegistrationBranchEntry[];
};

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

// GET: Fetches a single business (for the edit/delete popups)
export const getBusiness = async ({ params, request }: LoaderFunctionArgs): Promise<RegistrationBusinessEntry | null> => {
    try {
        const businessId = parseRegistrationId(params.id);
        if (businessId === null) throw redirect(ROUTES.SUPER_ADMIN.businesses);

        const res = await apiJson(`/registration/businesses/${businessId}`, { method: "GET" });

        if (res.status === 404) return null;

        await ensureOk(res, "Failed to retrieve business");

        return res.json();
    } catch (err) {
        throw handleErrRedirect(err, request, ROUTES.SUPER_ADMIN.businesses);
    }
};

// PATCH: Updates a business name/location
export const updateBusiness = async ({ params, request }: ActionFunctionArgs) => {
    try {
        const businessId = parseRegistrationId(params.id);
        if (businessId === null) throw redirect(ROUTES.SUPER_ADMIN.businesses);

        const formData = await request.formData();
        const business = validateForm(formData, BusinessEntityUpdateSchema, "Invalid business data");

        const res = await apiJson(`/registration/businesses/${businessId}`, { method: "PATCH", body: JSON.stringify(business) });

        await ensureOkOrRedirect(res, "Failed to update business", request, ROUTES.SUPER_ADMIN.businesses);

        return redirectWithQuery(request, ROUTES.SUPER_ADMIN.businesses, "NOTIF=Changes saved");
    } catch (err) {
        return handleErrRedirect(err, request, ROUTES.SUPER_ADMIN.businesses);
    }
};

// DELETE: Deletes a business (linked rows are orphaned, not cascade-deleted)
export const deleteBusiness = async ({ params, request }: ActionFunctionArgs) => {
    try {
        const businessId = parseRegistrationId(params.id);
        if (businessId === null) throw redirect(ROUTES.SUPER_ADMIN.businesses);

        const res = await apiJson(`/registration/businesses/${businessId}`, { method: "DELETE" });

        await ensureOkOrRedirect(res, "Failed to delete business", request, ROUTES.SUPER_ADMIN.businesses);

        return redirectWithQuery(request, ROUTES.SUPER_ADMIN.businesses, "NOTIF=Business successfully deleted");
    } catch (err) {
        return handleErrRedirect(err, request, ROUTES.SUPER_ADMIN.businesses);
    }
};

// GET: Fetches a single branch (for the edit/delete popups)
export const getBranch = async ({ params, request }: LoaderFunctionArgs): Promise<RegistrationBranchEntry | null> => {
    try {
        const branchId = parseRegistrationId(params.id);
        if (branchId === null) throw redirect(ROUTES.HQ_ADMIN.manageUsers);

        const res = await apiJson(`/registration/branches/${branchId}`, { method: "GET" });

        if (res.status === 404) return null;

        await ensureOk(res, "Failed to retrieve branch");

        return res.json();
    } catch (err) {
        throw handleErrRedirect(err, request, ROUTES.HQ_ADMIN.manageUsers);
    }
};

// PATCH: Updates a branch location/account limit
export const updateBranch = async ({ params, request }: ActionFunctionArgs) => {
    try {
        const branchId = parseRegistrationId(params.id);
        if (branchId === null) throw redirect(ROUTES.HQ_ADMIN.manageUsers);

        const formData = await request.formData();
        const branch = validateForm(formData, BranchEntityUpdateSchema, "Invalid branch data");

        const res = await apiJson(`/registration/branches/${branchId}`, { method: "PATCH", body: JSON.stringify(branch) });

        await ensureOkOrRedirect(res, "Failed to update branch", request, ROUTES.HQ_ADMIN.manageUsers);

        return redirectWithQuery(request, ROUTES.HQ_ADMIN.manageUsers, "NOTIF=Changes saved");
    } catch (err) {
        return handleErrRedirect(err, request, ROUTES.HQ_ADMIN.manageUsers);
    }
};

// DELETE: Deletes a branch with a cascade (inventory/offer junctions removed, users/transactions orphaned)
export const deleteBranch = async ({ params, request }: ActionFunctionArgs) => {
    try {
        const branchId = parseRegistrationId(params.id);
        if (branchId === null) throw redirect(ROUTES.HQ_ADMIN.manageUsers);

        const res = await apiJson(`/registration/branches/${branchId}`, { method: "DELETE" });

        await ensureOkOrRedirect(res, "Failed to delete branch", request, ROUTES.HQ_ADMIN.manageUsers);

        return redirectWithQuery(request, ROUTES.HQ_ADMIN.manageUsers, "NOTIF=Branch successfully deleted");
    } catch (err) {
        return handleErrRedirect(err, request, ROUTES.HQ_ADMIN.manageUsers);
    }
};

// GET: Fetches a single subscriber (HQ admin) account
export const getSubscriber = async ({ params, request }: LoaderFunctionArgs): Promise<RegistrationUserEntry | null> => {
    try {
        const userId = parseRegistrationId(params.id);
        if (userId === null) throw redirect(ROUTES.SUPER_ADMIN.subscriberAccounts);

        const res = await apiJson(`/registration/subscribers/${userId}`, { method: "GET" });

        if (res.status === 404) return null;

        await ensureOk(res, "Failed to retrieve subscriber account");

        return res.json();
    } catch (err) {
        throw handleErrRedirect(err, request, ROUTES.SUPER_ADMIN.subscriberAccounts);
    }
};

// GET: Fetches the delete-confirmation context for a subscriber
export const getSubscriberDeleteContext = async ({ params, request }: LoaderFunctionArgs): Promise<DeleteContextData> => {
    try {
        const userId = parseRegistrationId(params.id);
        if (userId === null) throw redirect(ROUTES.SUPER_ADMIN.subscriberAccounts);

        const res = await apiJson(`/registration/subscribers/${userId}/delete-context`, { method: "GET" });

        await ensureOk(res, "Failed to retrieve subscriber delete context");

        return res.json();
    } catch (err) {
        throw handleErrRedirect(err, request, ROUTES.SUPER_ADMIN.subscriberAccounts);
    }
};

// PATCH: Updates a subscriber (FN/LN/email/business)
export const updateSubscriber = async ({ params, request }: ActionFunctionArgs) => {
    try {
        const userId = parseRegistrationId(params.id);
        if (userId === null) throw redirect(ROUTES.SUPER_ADMIN.subscriberAccounts);

        const formData = await request.formData();
        const user = validateForm(formData, AccountUpdateSchema, "Invalid subscriber data");

        const res = await apiJson(`/registration/subscribers/${userId}`, { method: "PATCH", body: JSON.stringify(user) });

        await ensureOkOrRedirect(res, "Failed to update subscriber", request, ROUTES.SUPER_ADMIN.subscriberAccounts);

        return redirectWithQuery(request, ROUTES.SUPER_ADMIN.subscriberAccounts, "NOTIF=Changes saved");
    } catch (err) {
        return handleErrRedirect(err, request, ROUTES.SUPER_ADMIN.subscriberAccounts);
    }
};

// DELETE: Deletes a subscriber account
export const deleteSubscriber = async ({ params, request }: ActionFunctionArgs) => {
    try {
        const userId = parseRegistrationId(params.id);
        if (userId === null) throw redirect(ROUTES.SUPER_ADMIN.subscriberAccounts);

        const res = await apiJson(`/registration/subscribers/${userId}`, { method: "DELETE" });

        await ensureOkOrRedirect(res, "Failed to delete subscriber", request, ROUTES.SUPER_ADMIN.subscriberAccounts);

        return redirectWithQuery(request, ROUTES.SUPER_ADMIN.subscriberAccounts, "NOTIF=Subscriber successfully deleted");
    } catch (err) {
        return handleErrRedirect(err, request, ROUTES.SUPER_ADMIN.subscriberAccounts);
    }
};

// GET: Fetches a single branch manager account
export const getManager = async ({ params, request }: LoaderFunctionArgs): Promise<RegistrationUserEntry | null> => {
    try {
        const userId = parseRegistrationId(params.id);
        if (userId === null) throw redirect(ROUTES.HQ_ADMIN.manageUsers);

        const res = await apiJson(`/registration/managers/${userId}`, { method: "GET" });

        if (res.status === 404) return null;

        await ensureOk(res, "Failed to retrieve manager account");

        return res.json();
    } catch (err) {
        throw handleErrRedirect(err, request, ROUTES.HQ_ADMIN.manageUsers);
    }
};

// GET: Fetches the delete-confirmation context for a branch manager
export const getManagerDeleteContext = async ({ params, request }: LoaderFunctionArgs): Promise<DeleteContextData> => {
    try {
        const userId = parseRegistrationId(params.id);
        if (userId === null) throw redirect(ROUTES.HQ_ADMIN.manageUsers);

        const res = await apiJson(`/registration/managers/${userId}/delete-context`, { method: "GET" });

        await ensureOk(res, "Failed to retrieve manager delete context");

        return res.json();
    } catch (err) {
        throw handleErrRedirect(err, request, ROUTES.HQ_ADMIN.manageUsers);
    }
};

// PATCH: Updates a branch manager (FN/LN/email/branch)
export const updateManager = async ({ params, request }: ActionFunctionArgs) => {
    try {
        const userId = parseRegistrationId(params.id);
        if (userId === null) throw redirect(ROUTES.HQ_ADMIN.manageUsers);

        const formData = await request.formData();
        const user = validateForm(formData, AccountUpdateSchema, "Invalid manager data");

        const res = await apiJson(`/registration/managers/${userId}`, { method: "PATCH", body: JSON.stringify(user) });

        await ensureOkOrRedirect(res, "Failed to update manager", request, ROUTES.HQ_ADMIN.manageUsers);

        return redirectWithQuery(request, ROUTES.HQ_ADMIN.manageUsers, "NOTIF=Changes saved");
    } catch (err) {
        return handleErrRedirect(err, request, ROUTES.HQ_ADMIN.manageUsers);
    }
};

// DELETE: Deletes a branch manager account
export const deleteManager = async ({ params, request }: ActionFunctionArgs) => {
    try {
        const userId = parseRegistrationId(params.id);
        if (userId === null) throw redirect(ROUTES.HQ_ADMIN.manageUsers);

        const res = await apiJson(`/registration/managers/${userId}`, { method: "DELETE" });

        await ensureOkOrRedirect(res, "Failed to delete manager", request, ROUTES.HQ_ADMIN.manageUsers);

        return redirectWithQuery(request, ROUTES.HQ_ADMIN.manageUsers, "NOTIF=Manager successfully deleted");
    } catch (err) {
        return handleErrRedirect(err, request, ROUTES.HQ_ADMIN.manageUsers);
    }
};

// GET: Fetches a single cashier account
export const getCashier = async ({ params, request }: LoaderFunctionArgs): Promise<RegistrationUserEntry | null> => {
    try {
        const userId = parseRegistrationId(params.id);
        if (userId === null) throw redirect(ROUTES.BRANCH_MANAGER.manageUsers);

        const res = await apiJson(`/registration/cashiers/${userId}`, { method: "GET" });

        if (res.status === 404) return null;

        await ensureOk(res, "Failed to retrieve cashier account");

        return res.json();
    } catch (err) {
        throw handleErrRedirect(err, request, ROUTES.BRANCH_MANAGER.manageUsers);
    }
};

// GET: Fetches the subscriber edit form data (account + business options)
export const getSubscriberForm = async (args: LoaderFunctionArgs): Promise<SubscriberFormLoaderData> => {
    try {
        const [subscriber, businesses] = await Promise.all([getSubscriber(args), getBusinesses(args)]);

        return { subscriber, businesses };
    } catch (err) {
        throw handleErrRedirect(err, args.request, ROUTES.SUPER_ADMIN.subscriberAccounts);
    }
};

// GET: Fetches the manager edit form data (account + branch options)
export const getManagerForm = async (args: LoaderFunctionArgs): Promise<ManagerFormLoaderData> => {
    try {
        const manager = await getManager(args);
        const branches = await getBranches(args);

        return { manager, branches };
    } catch (err) {
        throw handleErrRedirect(err, args.request, ROUTES.HQ_ADMIN.manageUsers);
    }
};

// GET: Fetches the cashier edit form data (account + branch options)
export const getCashierForm = async (args: LoaderFunctionArgs): Promise<CashierFormLoaderData> => {
    try {
        const cashier = await getCashier(args);
        const branches = await getBranches(args);

        return { cashier, branches };
    } catch (err) {
        throw handleErrRedirect(err, args.request, ROUTES.BRANCH_MANAGER.manageUsers);
    }
};

// PATCH: Updates a cashier (FN/LN/email/branch)
export const updateCashier = async ({ params, request }: ActionFunctionArgs) => {
    try {
        const userId = parseRegistrationId(params.id);
        if (userId === null) throw redirect(ROUTES.BRANCH_MANAGER.manageUsers);

        const formData = await request.formData();
        const user = validateForm(formData, AccountUpdateSchema, "Invalid cashier data");

        const res = await apiJson(`/registration/cashiers/${userId}`, { method: "PATCH", body: JSON.stringify(user) });

        await ensureOkOrRedirect(res, "Failed to update cashier", request, ROUTES.BRANCH_MANAGER.manageUsers);

        return redirectWithQuery(request, ROUTES.BRANCH_MANAGER.manageUsers, "NOTIF=Changes saved");
    } catch (err) {
        return handleErrRedirect(err, request, ROUTES.BRANCH_MANAGER.manageUsers);
    }
};

// DELETE: Deletes a cashier (its transactions survive, they are just unlinked)
export const deleteCashier = async ({ params, request }: ActionFunctionArgs) => {
    try {
        const userId = parseRegistrationId(params.id);
        if (userId === null) throw redirect(ROUTES.BRANCH_MANAGER.manageUsers);

        const res = await apiJson(`/registration/cashiers/${userId}`, { method: "DELETE" });

        await ensureOkOrRedirect(res, "Failed to delete cashier", request, ROUTES.BRANCH_MANAGER.manageUsers);

        return redirectWithQuery(request, ROUTES.BRANCH_MANAGER.manageUsers, "NOTIF=User successfully deleted");
    } catch (err) {
        return handleErrRedirect(err, request, ROUTES.BRANCH_MANAGER.manageUsers);
    }
};

// POST: Resends the email verification link to an unverified account with an expired (or cleared) token.
export const resendVerificationEmail = async (userId: number) => {
    const res = await apiJson(`/registration/account/${userId}/resend-verification`, {
        method: "POST",
    });

    if (!res.ok) {
        const apiError = await res.json().catch(() => null);
        const message = apiError?.message ?? apiError?.error ?? FALLBACK_ERROR;
        throw new Error(typeof message === "string" ? message : FALLBACK_ERROR);
    }

    return res.json();
};

// POST: Resends the verification email (Route action for the resend-confirmation popup).
export const resendVerification = async ({ params, request }: ActionFunctionArgs) => {
    const userId = parseRegistrationId(params.id);

    try {
        const formData = await request.formData();
        const returnTo = formData.get("redirectTo")?.toString() ?? ROUTES.HQ_ADMIN.manageUsers;
        if (userId === null) throw redirect(returnTo);

        await resendVerificationEmail(userId);

        return redirectWithQuery(request, returnTo, "NOTIF=Verification email resent successfully");
    } catch (err) {
        const returnTo =
            (await request.formData().then((f) => f.get("redirectTo")?.toString()).catch(() => null)) ??
            ROUTES.HQ_ADMIN.manageUsers;

        const message = err instanceof Error ? err.message : FALLBACK_ERROR;

        return redirectWithQuery(request, returnTo, `ERROR=${encodeURIComponent(message)}`);
    }
};

// PATCH: Deactivates / reactivates an account (Shared Manage radio popup action)
export const manageAccountStatus = async ({ params, request }: ActionFunctionArgs) => {
    const formData = await request.formData();
    const redirectTo = formData.get("redirectTo")?.toString() ?? ROUTES.HQ_ADMIN.manageUsers;

    try {
        const userId = parseRegistrationId(params.id);
        if (userId === null) throw redirect(redirectTo);

        const payload = validateForm(formData, ManageAccountStatusSchema, "Invalid account action");

        const res = await apiJson(`/registration/account/${userId}/status`, { method: "PATCH", body: JSON.stringify(payload) });

        await ensureOkOrRedirect(res, "Failed to update account status", request, redirectTo);

        return redirectWithQuery(request, redirectTo, "NOTIF=Account status updated");
    } catch (err) {
        return handleErrRedirect(err, request, redirectTo);
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
