// General Imports
import { redirect, type ActionFunctionArgs, type LoaderFunctionArgs } from "react-router";

// BuyBuyIn Shared Imports
import {
    BranchWideOfferFormSchema,
    type BranchWideOfferEntry,
    type BranchWideOfferListResponse,
    type BranchWideOfferOptionsResponse,
} from "@buybuyin/shared/schema/branchWideOffer";

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

const parseOfferId = (id?: string) => {
    const offerId = Number(id);

    return Number.isInteger(offerId) && offerId > 0 ? offerId : null;
};

// ----------------------------- LOADERS ---------------------------------------------------

const fetchBranchWideOffers = async (
    { request }: LoaderFunctionArgs,
    redirectPath: string,
    limit = "100"
): Promise<BranchWideOfferListResponse> => {
    try {
        const { query } = extractQueryToObject(request);

        const queryString = buildQueryString({ ...query, limit });

        // Main Fetch Request
        const res = await apiJson(`/branch-wide-offers${queryString ? `?${queryString}` : ""}`, { method: "GET" });

        await ensureOk(res, "Failed to retrieve branch-wide offers");

        return res.json();
    } catch (err) {
        throw handleErrRedirect(err, request, redirectPath);
    }
};

const fetchBranchWideOffer = async (
    { params, request }: LoaderFunctionArgs,
    redirectPath: string
): Promise<BranchWideOfferEntry | null> => {
    try {
        const offerId = parseOfferId(params.id);

        if (offerId === null) {
            throw redirect(redirectPath);
        }

        // Main Fetch Request
        const res = await apiJson(`/branch-wide-offers/${offerId}`, { method: "GET" });

        if (res.status === 404) {
            return null;
        }

        await ensureOk(res, "Failed to retrieve branch-wide offer");

        return res.json();
    } catch (err) {
        throw handleErrRedirect(err, request, redirectPath);
    }
};

const fetchBranchWideOfferOptions = async (
    { request }: LoaderFunctionArgs,
    redirectPath: string
): Promise<BranchWideOfferOptionsResponse> => {
    try {
        // Main Fetch Request
        const res = await apiJson("/branch-wide-offers/options", { method: "GET" });

        await ensureOk(res, "Failed to retrieve branch-wide offer options");

        return res.json();
    } catch (err) {
        throw handleErrRedirect(err, request, redirectPath);
    }
};

// ----------------------------- ACTIONS ---------------------------------------------------

const createOfferAction = async ({ request }: ActionFunctionArgs, redirectPath: string) => {
    try {
        const formData = await request.formData();

        // ZOD Schema Checking
        const offer = validateForm(formData, BranchWideOfferFormSchema, "Invalid branch-wide offer data");

        // Main Fetch Request
        const res = await apiJson("/branch-wide-offers", { method: "POST", body: JSON.stringify(offer) });

        await ensureOkOrRedirect(res, "Failed to create branch-wide offer", request, redirectPath);

        return redirectWithQuery(request, redirectPath, "NOTIF=Offer successfully created");
    } catch (err) {
        return handleErrRedirect(err, request, redirectPath);
    }
};

const updateOfferAction = async ({ params, request }: ActionFunctionArgs, redirectPath: string) => {
    try {
        const offerId = parseOfferId(params.id);

        if (offerId === null) {
            throw redirect(redirectPath);
        }

        const formData = await request.formData();

        // ZOD Schema Checking
        const offer = validateForm(formData, BranchWideOfferFormSchema, "Invalid branch-wide offer data");

        // Main Fetch Request
        const res = await apiJson(`/branch-wide-offers/${offerId}`, {
            method: "PATCH",
            body: JSON.stringify(offer),
        });

        await ensureOkOrRedirect(res, "Failed to update branch-wide offer", request, redirectPath);

        return redirectWithQuery(request, redirectPath, "NOTIF=Offer successfully updated");
    } catch (err) {
        return handleErrRedirect(err, request, redirectPath);
    }
};

const deleteOfferAction = async ({ params, request }: ActionFunctionArgs, redirectPath: string) => {
    try {
        const offerId = parseOfferId(params.id);

        if (offerId === null) {
            throw redirect(redirectPath);
        }

        // Main Fetch Request
        const res = await apiJson(`/branch-wide-offers/${offerId}`, { method: "DELETE" });

        await ensureOkOrRedirect(res, "Failed to delete branch-wide offer", request, redirectPath);

        return redirectWithQuery(request, redirectPath, "NOTIF=Offer successfully deleted");
    } catch (err) {
        return handleErrRedirect(err, request, redirectPath);
    }
};

const updateOfferStatusAction = async ({ params, request }: ActionFunctionArgs, redirectPath: string) => {
    try {
        const offerId = parseOfferId(params.id);

        if (offerId === null) {
            throw redirect(redirectPath);
        }

        const formData = await request.formData();
        const res = await apiJson(`/branch-wide-offers/${offerId}/status`, {
            method: "PATCH",
            body: JSON.stringify({ offerStatus: formData.get("offerStatus") }),
        });

        await ensureOkOrRedirect(res, "Failed to update offer status", request, redirectPath);

        return redirectWithQuery(request, redirectPath, "NOTIF=Offer status updated");
    } catch (err) {
        return handleErrRedirect(err, request, redirectPath);
    }
};

// ----------------------------- BRANCH MANAGER EXPORTS ------------------------------------

// GET: Fetches the branch-wide offers
export const getBranchWideOffers = (args: LoaderFunctionArgs): Promise<BranchWideOfferListResponse> =>
    fetchBranchWideOffers(args, ROUTES.BRANCH_MANAGER.branchOffers);

// GET: Fetches a single branch-wide offer
export const getBranchWideOffer = (args: LoaderFunctionArgs): Promise<BranchWideOfferEntry | null> =>
    fetchBranchWideOffer(args, ROUTES.BRANCH_MANAGER.branchOffers);

// PATCH: Updates the status of a branch-exclusive offer
export const updateBranchWideOfferStatus = (args: ActionFunctionArgs) =>
    updateOfferStatusAction(args, ROUTES.BRANCH_MANAGER.branchOffers);

export type BranchWideOffersPageData = {
    list: BranchWideOfferListResponse;
    options: BranchWideOfferOptionsResponse;
};

// GET: Fetches the list and options for the branch manager branch-wide offers page
export const getBranchWideOffersPage = async (args: LoaderFunctionArgs): Promise<BranchWideOffersPageData> => {
    const [list, options] = await Promise.all([
        fetchBranchWideOffers(args, ROUTES.BRANCH_MANAGER.branchOffers, "8"),
        fetchBranchWideOfferOptions(args, ROUTES.BRANCH_MANAGER.branchOffers),
    ]);

    return { list, options };
};

// ----------------------------- HQ ADMIN EXPORTS ------------------------------------------

export type HQBranchWideOffersPageData = {
    list: BranchWideOfferListResponse;
    options: BranchWideOfferOptionsResponse;
    offer: BranchWideOfferEntry | null;
};

// GET: Fetches the business-wide branch-wide offers
export const getHQBranchWideOffers = (args: LoaderFunctionArgs): Promise<BranchWideOfferListResponse> =>
    fetchBranchWideOffers(args, ROUTES.HQ_ADMIN.branchOffers);

// GET: Fetches a single business-wide branch-wide offer
export const getHQBranchWideOffer = (args: LoaderFunctionArgs): Promise<BranchWideOfferEntry | null> =>
    fetchBranchWideOffer(args, ROUTES.HQ_ADMIN.branchOffers);

// GET: Fetches the options for the business-wide branch-wide offer forms
export const getHQBranchWideOfferOptions = (args: LoaderFunctionArgs): Promise<BranchWideOfferOptionsResponse> =>
    fetchBranchWideOfferOptions(args, ROUTES.HQ_ADMIN.branchOffers);

// GET: Fetches the list and options for the HQ branch-wide offers page
export const getHQBranchWideOffersPage = async (args: LoaderFunctionArgs): Promise<HQBranchWideOffersPageData> => {
    const [list, options] = await Promise.all([getHQBranchWideOffers(args), getHQBranchWideOfferOptions(args)]);

    return { list, options, offer: null };
};

// GET: Fetches the list, options, and offer for the HQ branch-wide offer edit page
export const getHQBranchWideOfferEditPage = async (args: LoaderFunctionArgs): Promise<HQBranchWideOffersPageData> => {
    const [list, options, offer] = await Promise.all([
        getHQBranchWideOffers(args),
        getHQBranchWideOfferOptions(args),
        getHQBranchWideOffer(args),
    ]);

    if (!offer) {
        throw redirect(ROUTES.HQ_ADMIN.branchOffers);
    }

    return { list, options, offer };
};

// POST: Creates a business-wide branch-wide offer
export const createHQBranchWideOffer = (args: ActionFunctionArgs) =>
    createOfferAction(args, ROUTES.HQ_ADMIN.branchOffers);

// PATCH: Updates any branch-wide offer in the business
export const updateHQBranchWideOffer = (args: ActionFunctionArgs) =>
    updateOfferAction(args, ROUTES.HQ_ADMIN.branchOffers);

// DELETE: Removes any branch-wide offer in the business
export const deleteHQBranchWideOffer = (args: ActionFunctionArgs) =>
    deleteOfferAction(args, ROUTES.HQ_ADMIN.branchOffers);
