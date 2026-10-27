// General Imports
import { redirect, type ActionFunctionArgs, type LoaderFunctionArgs } from "react-router";

// BuyBuyIn Shared Imports
import {
    BranchInventoryFormCreateSchema,
    BranchInventoryFormRestockSchema,
    type BranchInventoryEntry,
    type BranchInventoryListResponse,
    type BranchInventoryOptionsResponse,
} from "@buybuyin/shared/schema/branchInventory";

// API Services
import {
    apiJson,
    buildQueryString,
    ensureOk,
    ensureOkOrRedirect,
    extractQueryToObject,
    handleErrRedirect,
    redirectWithQuery,
    validateForm,
} from "./actionService";

// Routes & Utils
import { ROUTES } from "../routes/Routes";

const parseItemId = (id?: string) => {
    const itemId = Number(id);

    return Number.isInteger(itemId) && itemId > 0 ? itemId : null;
};

// GET: Fetches the branch inventory
export const getBranchInventory = async ({ request }: LoaderFunctionArgs): Promise<BranchInventoryListResponse> => {
    try {
        const { query } = extractQueryToObject(request);

        const queryString = buildQueryString({ ...query, limit: "100" });

        // Main Fetch Request
        const res = await apiJson(`/branch-inventory${queryString ? `?${queryString}` : ""}`, { method: "GET" });

        await ensureOk(res, "Failed to retrieve branch inventory");

        return res.json();
    } catch (err) {
        throw handleErrRedirect(err, request, ROUTES.BRANCH_MANAGER.inventory);
    }
};

// GET: Fetches a single branch inventory item
export const getBranchInventoryItem = async ({
    params,
    request,
}: LoaderFunctionArgs): Promise<BranchInventoryEntry | null> => {
    try {
        const itemId = parseItemId(params.id);

        if (itemId === null) {
            throw redirect(ROUTES.BRANCH_MANAGER.inventory);
        }

        // Main Fetch Request
        const res = await apiJson(`/branch-inventory/${itemId}`, { method: "GET" });

        if (res.status === 404) {
            return null;
        }

        await ensureOk(res, "Failed to retrieve inventory item");

        return res.json();
    } catch (err) {
        throw handleErrRedirect(err, request, ROUTES.BRANCH_MANAGER.inventory);
    }
};

// GET: Fetches the product options for the inventory forms
export const getBranchInventoryOptions = async ({
    request,
}: LoaderFunctionArgs): Promise<BranchInventoryOptionsResponse> => {
    try {
        // Main Fetch Request
        const res = await apiJson("/branch-inventory/options", { method: "GET" });

        await ensureOk(res, "Failed to retrieve inventory options");

        return res.json();
    } catch (err) {
        throw handleErrRedirect(err, request, ROUTES.BRANCH_MANAGER.inventory);
    }
};

// POST: Adds a product to the branch inventory
export const createBranchInventoryItem = async ({ request }: ActionFunctionArgs) => {
    try {
        const formData = await request.formData();

        // ZOD Schema Checking
        const item = validateForm(formData, BranchInventoryFormCreateSchema, "Invalid inventory item data");

        // Main Fetch Request
        const res = await apiJson("/branch-inventory", { method: "POST", body: JSON.stringify(item) });

        await ensureOkOrRedirect(res, "Failed to add inventory item", request, ROUTES.BRANCH_MANAGER.inventory);

        return redirectWithQuery(request, ROUTES.BRANCH_MANAGER.inventory, "NOTIF=Item successfully added");
    } catch (err) {
        return handleErrRedirect(err, request, ROUTES.BRANCH_MANAGER.inventory);
    }
};

// PATCH: Restocks an existing branch inventory item
export const restockBranchInventoryItem = async ({ params, request }: ActionFunctionArgs) => {
    try {
        const itemId = parseItemId(params.id);

        if (itemId === null) {
            throw redirect(ROUTES.BRANCH_MANAGER.inventory);
        }

        const formData = await request.formData();

        // ZOD Schema Checking
        const item = validateForm(formData, BranchInventoryFormRestockSchema, "Invalid restock data");

        // Main Fetch Request
        const res = await apiJson(`/branch-inventory/${itemId}/restock`, {
            method: "PATCH",
            body: JSON.stringify(item),
        });

        await ensureOkOrRedirect(res, "Failed to restock inventory item", request, ROUTES.BRANCH_MANAGER.inventory);

        return redirectWithQuery(request, ROUTES.BRANCH_MANAGER.inventory, "NOTIF=Changes saved");
    } catch (err) {
        return handleErrRedirect(err, request, ROUTES.BRANCH_MANAGER.inventory);
    }
};

// DELETE: Removes a branch inventory item
export const deleteBranchInventoryItem = async ({ params, request }: ActionFunctionArgs) => {
    try {
        const itemId = parseItemId(params.id);

        if (itemId === null) {
            throw redirect(ROUTES.BRANCH_MANAGER.inventory);
        }

        // Main Fetch Request
        const res = await apiJson(`/branch-inventory/${itemId}`, { method: "DELETE" });

        await ensureOkOrRedirect(res, "Failed to remove inventory item", request, ROUTES.BRANCH_MANAGER.inventory);

        return redirectWithQuery(request, ROUTES.BRANCH_MANAGER.inventory, "NOTIF=Successfully deleted");
    } catch (err) {
        return handleErrRedirect(err, request, ROUTES.BRANCH_MANAGER.inventory);
    }
};
