// General Imports
import { redirect, type ActionFunctionArgs, type LoaderFunctionArgs } from "react-router";

// BuyBuyIn Shared Imports
import {
    SupplierFormCreateSchema,
    SupplierFormUpdateSchema,
    type SupplierEntry,
    type SupplierListResponse,
} from "@buybuyin/shared/schema/supplier";
import type { CatalogueListResponse } from "@buybuyin/shared/schema/product";

// API Services
import {
    apiJson,
    ensureOk,
    ensureOkOrRedirect,
    handleErrRedirect,
    redirectWithQuery,
    validateForm,
} from "./actionService";
import { getCatalogue } from "./productService";

// Routes & Utils
import { ROUTES } from "../routes/Routes";

export type CataloguePageData = CatalogueListResponse & { suppliers: SupplierEntry[] };

const parseSupplierId = (id?: string) => {
    const supplierId = Number(id);

    return Number.isInteger(supplierId) && supplierId > 0 ? supplierId : null;
};

// GET: Fetches the supplier listing (Table paginates client-side)
export const getSupplierList = async ({ request }: LoaderFunctionArgs): Promise<SupplierListResponse> => {
    try {
        // The Table paginates client-side, so request the API maximum up front.
        const res = await apiJson("/supplier?limit=100", { method: "GET" });

        await ensureOk(res, "Failed to retrieve suppliers");

        return res.json();
    } catch (err) {
        throw handleErrRedirect(err, request, ROUTES.HQ_ADMIN.catalogue);
    }
};

// GET: Fetches the catalogue page data (products + suppliers)
export const getCataloguePage = async (args: LoaderFunctionArgs): Promise<CataloguePageData> => {
    try {
        // Main Fetch Requests
        const [catalogue, supplierList] = await Promise.all([getCatalogue(args), getSupplierList(args)]);

        return { ...catalogue, suppliers: supplierList.suppliers };
    } catch (err) {
        throw handleErrRedirect(err, args.request, ROUTES.HQ_ADMIN.catalogue);
    }
};

// GET: Fetches a single supplier
export const getSupplier = async ({ params, request }: LoaderFunctionArgs): Promise<SupplierEntry | null> => {
    try {
        const supplierId = parseSupplierId(params.id);

        if (supplierId === null) {
            throw redirect(ROUTES.HQ_ADMIN.catalogue);
        }

        // Main Fetch Request
        const res = await apiJson(`/supplier/${supplierId}`, { method: "GET" });

        if (res.status === 404) {
            return null;
        }

        await ensureOk(res, "Failed to retrieve supplier");

        return res.json();
    } catch (err) {
        throw handleErrRedirect(err, request, ROUTES.HQ_ADMIN.catalogue);
    }
};

// POST: Creates a supplier
export const createSupplier = async ({ request }: ActionFunctionArgs) => {
    try {
        const formData = await request.formData();

        // ZOD Schema Checking
        const supplier = validateForm(formData, SupplierFormCreateSchema, "Invalid supplier data");

        // Main Fetch Request
        const res = await apiJson("/supplier", { method: "POST", body: JSON.stringify(supplier) });

        await ensureOkOrRedirect(res, "Failed to create supplier", request, ROUTES.HQ_ADMIN.catalogue);

        return redirectWithQuery(request, ROUTES.HQ_ADMIN.catalogue, "NOTIF=Supplier created successfully");
    } catch (err) {
        return handleErrRedirect(err, request, ROUTES.HQ_ADMIN.catalogue);
    }
};

// PATCH: Updates a supplier
export const updateSupplier = async ({ params, request }: ActionFunctionArgs) => {
    try {
        const supplierId = parseSupplierId(params.id);

        if (supplierId === null) {
            throw redirect(ROUTES.HQ_ADMIN.catalogue);
        }

        const formData = await request.formData();

        // ZOD Schema Checking
        const supplier = validateForm(formData, SupplierFormUpdateSchema, "Invalid supplier data");

        // Main Fetch Request
        const res = await apiJson(`/supplier/${supplierId}`, { method: "PATCH", body: JSON.stringify(supplier) });

        await ensureOkOrRedirect(res, "Failed to update supplier", request, ROUTES.HQ_ADMIN.catalogue);

        return redirectWithQuery(request, ROUTES.HQ_ADMIN.catalogue, "NOTIF=Supplier updated successfully");
    } catch (err) {
        return handleErrRedirect(err, request, ROUTES.HQ_ADMIN.catalogue);
    }
};

// DELETE: Removes a supplier
export const deleteSupplier = async ({ params, request }: ActionFunctionArgs) => {
    try {
        const supplierId = parseSupplierId(params.id);

        if (supplierId === null) {
            throw redirect(ROUTES.HQ_ADMIN.catalogue);
        }

        // Main Fetch Request
        const res = await apiJson(`/supplier/${supplierId}`, { method: "DELETE" });

        await ensureOkOrRedirect(res, "Failed to delete supplier", request, ROUTES.HQ_ADMIN.catalogue);

        return redirectWithQuery(request, ROUTES.HQ_ADMIN.catalogue, "NOTIF=Supplier deleted successfully");
    } catch (err) {
        return handleErrRedirect(err, request, ROUTES.HQ_ADMIN.catalogue);
    }
};
