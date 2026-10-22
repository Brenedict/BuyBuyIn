// General Imports
import { redirect, type ActionFunctionArgs, type LoaderFunctionArgs } from "react-router";

// BuyBuyIn Shared Imports
import {
    ProductFormCreateSchema,
    ProductFormUpdateSchema,
    type CatalogueListResponse,
    type CatalogueOptionsResponse,
    type CatalogueProduct,
} from "@buybuyin/shared/schema/product";

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

export type ProductFormLoaderData = {
    product: CatalogueProduct | null;
    options: CatalogueOptionsResponse;
};

const parseProductId = (id?: string) => {
    const productId = Number(id);

    return Number.isInteger(productId) && productId > 0 ? productId : null;
};

// GET: Fetches the paginated catalogue listing
export const getCatalogue = async ({ request }: LoaderFunctionArgs): Promise<CatalogueListResponse> => {
    try {
        const { query } = extractQueryToObject(request);

        // The Table paginates client-side, so request the API maximum up front.
        const queryString = buildQueryString({ ...query, limit: "100" });

        // Main Fetch Request
        const res = await apiJson(`/product${queryString ? `?${queryString}` : ""}`, { method: "GET" });

        await ensureOk(res, "Failed to retrieve catalogue");

        return res.json();
    } catch (err) {
        throw handleErrRedirect(err, request, ROUTES.HQ_ADMIN.catalogue);
    }
};

// GET: Fetches a single catalogue product
export const getProduct = async ({ params, request }: LoaderFunctionArgs): Promise<CatalogueProduct | null> => {
    try {
        const productId = parseProductId(params.id);

        if (productId === null) {
            throw redirect(ROUTES.HQ_ADMIN.catalogue);
        }

        // Main Fetch Request
        const res = await apiJson(`/product/${productId}`, { method: "GET" });

        if (res.status === 404) {
            return null;
        }

        await ensureOk(res, "Failed to retrieve product");

        return res.json();
    } catch (err) {
        throw handleErrRedirect(err, request, ROUTES.HQ_ADMIN.catalogue);
    }
};

// GET: Fetches the option lists for the add form (no product to load)
export const getProductForm = async ({ request }: LoaderFunctionArgs): Promise<ProductFormLoaderData> => {
    try {
        // Main Fetch Request
        const res = await apiJson("/product/options", { method: "GET" });

        await ensureOk(res, "Failed to retrieve product options");

        const options: CatalogueOptionsResponse = await res.json();

        return { product: null, options };
    } catch (err) {
        throw handleErrRedirect(err, request, ROUTES.HQ_ADMIN.catalogue);
    }
};

// GET: Fetches a single catalogue product together with its option lists
export const getCatalogueProduct = async ({ params, request }: LoaderFunctionArgs): Promise<ProductFormLoaderData> => {
    try {
        const productId = parseProductId(params.id);

        if (productId === null) {
            throw redirect(ROUTES.HQ_ADMIN.catalogue);
        }

        // Main Fetch Requests
        const [productRes, optionsRes] = await Promise.all([
            apiJson(`/product/${productId}`, { method: "GET" }),
            apiJson("/product/options", { method: "GET" }),
        ]);

        await ensureOk(optionsRes, "Failed to retrieve product options");

        const options: CatalogueOptionsResponse = await optionsRes.json();

        // Let the popup render its own not-found state.
        if (productRes.status === 404) {
            return { product: null, options };
        }

        await ensureOk(productRes, "Failed to retrieve product");

        const product: CatalogueProduct = await productRes.json();

        return { product, options };
    } catch (err) {
        throw handleErrRedirect(err, request, ROUTES.HQ_ADMIN.catalogue);
    }
};

// GET: Fetches the supplier and category options for the product forms
export const getProductOptions = async ({ request }: LoaderFunctionArgs): Promise<CatalogueOptionsResponse> => {
    try {
        // Main Fetch Request
        const res = await apiJson("/product/options", { method: "GET" });

        await ensureOk(res, "Failed to retrieve product options");

        return res.json();
    } catch (err) {
        throw handleErrRedirect(err, request, ROUTES.HQ_ADMIN.catalogue);
    }
};

// POST: Creates a catalogue product
export const createProduct = async ({ request }: ActionFunctionArgs) => {
    try {
        const formData = await request.formData();

        // ZOD Schema Checking
        const product = validateForm(formData, ProductFormCreateSchema, "Invalid product data");

        // Main Fetch Request
        const res = await apiJson("/product", { method: "POST", body: JSON.stringify(product) });

        await ensureOkOrRedirect(res, "Failed to create product", request, ROUTES.HQ_ADMIN.catalogue);

        return redirectWithQuery(request, ROUTES.HQ_ADMIN.catalogue, "NOTIF=Product created successfully");
    } catch (err) {
        return handleErrRedirect(err, request, ROUTES.HQ_ADMIN.catalogue);
    }
};

// PATCH: Updates a catalogue product
export const updateProduct = async ({ params, request }: ActionFunctionArgs) => {
    try {
        const productId = parseProductId(params.id);

        if (productId === null) {
            throw redirect(ROUTES.HQ_ADMIN.catalogue);
        }

        const formData = await request.formData();

        // ZOD Schema Checking
        const product = validateForm(formData, ProductFormUpdateSchema, "Invalid product data");

        // Main Fetch Request
        const res = await apiJson(`/product/${productId}`, { method: "PATCH", body: JSON.stringify(product) });

        await ensureOkOrRedirect(res, "Failed to update product", request, ROUTES.HQ_ADMIN.catalogue);

        return redirectWithQuery(request, ROUTES.HQ_ADMIN.catalogue, "NOTIF=Product updated successfully");
    } catch (err) {
        return handleErrRedirect(err, request, ROUTES.HQ_ADMIN.catalogue);
    }
};

// DELETE: Removes a catalogue product
export const deleteProduct = async ({ params, request }: ActionFunctionArgs) => {
    try {
        const productId = parseProductId(params.id);

        if (productId === null) {
            throw redirect(ROUTES.HQ_ADMIN.catalogue);
        }

        // Main Fetch Request
        const res = await apiJson(`/product/${productId}`, { method: "DELETE" });

        await ensureOkOrRedirect(res, "Failed to delete product", request, ROUTES.HQ_ADMIN.catalogue);

        return redirectWithQuery(request, ROUTES.HQ_ADMIN.catalogue, "NOTIF=Product deleted successfully");
    } catch (err) {
        return handleErrRedirect(err, request, ROUTES.HQ_ADMIN.catalogue);
    }
};
