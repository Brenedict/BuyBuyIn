// General Imports
import type { Request, Response } from "express";
import type { BranchWideOfferUncheckedUpdateInput, BranchWideOfferWhereInput } from "@buybuyin/shared/prisma/models";
import type { User } from "@buybuyin/shared/prisma/browser";
import type {
    BranchWideOfferEntry,
    BranchWideOfferFormType,
    BranchWideOfferListResponse,
    BranchWideOfferOptionsResponse,
    BranchWideOfferQueryType,
    BranchWideOfferSummary,
} from "@buybuyin/shared/schema/branchWideOffer";
import type { CatalogueProduct } from "@buybuyin/shared/schema/product";

// Models
import BranchWideOfferModel from "../models/branchWideOffer.model";
import ProductModel from "../models/product.model";

// Utils
import { HttpError } from "../utils/error.util";

// ----------------------------- TYPES -----------------------------------------------------

type Requestor = Pick<User, "id" | "role" | "businessId" | "branchId">;
type OfferRow = NonNullable<Awaited<ReturnType<typeof BranchWideOfferModel.getOfferById>>>;
type SummaryRow = Awaited<ReturnType<typeof BranchWideOfferModel.getVisibleSummaryRows>>[number];
type ProductRow = NonNullable<Awaited<ReturnType<typeof ProductModel.getProductById>>>;
type OfferProductInput = BranchWideOfferFormType["products"][number];

type NormalizedOfferInput = {
    offerName: string;
    description: string;
    startDate: Date;
    endDate: Date;
    offerStatus: BranchWideOfferFormType["offerStatus"];
    offerType: BranchWideOfferFormType["offerType"];
    discountType: BranchWideOfferFormType["discountType"];
    overallDiscountValue: number | null;
    products: OfferProductInput[];
};

export type DeleteOfferResult = { message: string; deleted: boolean; archived: boolean };

// ----------------------------- PRIVATE FUNCTIONS -----------------------------------------

const resolveBranchId = (requestor: Requestor): number => {
    if (requestor.branchId === null) {
        throw new HttpError(403, "User is not attached to a branch");
    }

    return requestor.branchId;
};

const resolveBusinessId = (requestor: Requestor): number => {
    if (requestor.businessId === null) {
        throw new HttpError(403, "User is not attached to a business");
    }

    return requestor.businessId;
};

const parseDate = (value: string): Date => new Date(`${value}T00:00:00.000Z`);

const formatDate = (value: Date): string => value.toISOString().slice(0, 10);

const startOfToday = (): Date => {
    const now = new Date();

    return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
};

const normalizeInput = (input: BranchWideOfferFormType): NormalizedOfferInput => {
    const isOverall = input.offerType === "OVERALL";

    return {
        offerName: input.offerName,
        description: input.description,
        startDate: parseDate(input.startDate),
        endDate: parseDate(input.endDate),
        offerStatus: input.offerStatus,
        offerType: input.offerType,
        discountType: isOverall ? (input.discountType ?? null) : null,
        overallDiscountValue: isOverall ? (input.overallDiscountValue ?? null) : null,
        products: isOverall ? [] : input.products,
    };
};

const toOfferProductRows = (products: OfferProductInput[]) =>
    products.map((product) => ({
        productId: product.productId,
        unitDiscountValue: product.unitDiscountValue,
        requiredQuantity: product.requiredQuantity,
        discountType: product.discountType,
    }));

const mapProduct = (product: ProductRow): CatalogueProduct => ({
    id: product.id,
    productName: product.productName,
    basePrice: product.basePrice,
    shelfPrice: product.shelfPrice,
    category: product.productCategories[0]?.category ?? null,
    supplier: product.supplier,
});

const mapEntry = (row: OfferRow): BranchWideOfferEntry => ({
    id: row.id,
    offerName: row.offerName,
    description: row.description,
    startDate: formatDate(row.startDate),
    endDate: formatDate(row.endDate),
    isExclusive: row.isExclusive,
    offerStatus: row.offerStatus,
    offerType: row.offerType,
    discountType: row.discountType,
    overallDiscountValue: row.overallDiscountValue,
    branches: row.branchWideOfferBranches.map((association) => ({
        branchId: association.branchId,
        location: association.branch.location,
    })),
    products: row.branchWideOfferProducts.map((entry) => ({
        productId: entry.productId,
        productName: entry.product.productName,
        shelfPrice: entry.product.shelfPrice,
        unitDiscountValue: entry.unitDiscountValue,
        requiredQuantity: entry.requiredQuantity,
        discountType: entry.discountType,
    })),
});

const buildSummary = (rows: SummaryRow[], totalBranches: number): BranchWideOfferSummary => {
    const today = startOfToday().getTime();
    let activeOffers = 0;

    for (const row of rows) {
        const isWithinDates = row.startDate.getTime() <= today && row.endDate.getTime() >= today;

        if (row.offerStatus === "ENABLED" && isWithinDates) {
            activeOffers += 1;
        }
    }

    return {
        totalOffers: rows.length,
        activeOffers,
        inactiveOffers: rows.length - activeOffers,
        totalBranches,
    };
};

const assertProductsBelongToBusiness = async (businessId: number, products: OfferProductInput[]): Promise<void> => {
    if (products.length === 0) {
        return;
    }

    const productIds = products.map((product) => product.productId);
    const productCount = await ProductModel.count({ where: { id: { in: productIds }, businessId } });

    if (productCount !== productIds.length) {
        throw new HttpError(400, "Product not found in your business");
    }
};

const getVisibleOfferOrThrow = async (offerId: number, businessId: number, branchId: number): Promise<OfferRow> => {
    const offer = await BranchWideOfferModel.getVisibleOffer(offerId, businessId, branchId);

    if (!offer) {
        throw new HttpError(404, "Offer not found");
    }

    return offer;
};

// ----------------------------- PUBLIC FUNCTIONS ------------------------------------------

export default {
    resolveBranchId,
    resolveBusinessId,

    async getOffers(requestor: Requestor, query: BranchWideOfferQueryType): Promise<BranchWideOfferListResponse> {
        const businessId = resolveBusinessId(requestor);
        const branchId = resolveBranchId(requestor);
        const { search, offerStatus, offerType, page, limit } = query;

        const filters: BranchWideOfferWhereInput[] = [BranchWideOfferModel.getVisibleWhere(businessId, branchId)];

        if (search) {
            filters.push({
                OR: [
                    { offerName: { contains: search, mode: "insensitive" } },
                    { description: { contains: search, mode: "insensitive" } },
                ],
            });
        }

        if (offerStatus) {
            filters.push({ offerStatus });
        }

        if (offerType) {
            filters.push({ offerType });
        }

        const where: BranchWideOfferWhereInput = { AND: filters };

        const [offers, total, summaryRows, totalBranches] = await Promise.all([
            BranchWideOfferModel.getOffers({
                where,
                skip: (page - 1) * limit,
                take: limit,
                orderBy: [{ startDate: "desc" }, { id: "desc" }],
            }),
            BranchWideOfferModel.count({ where }),
            BranchWideOfferModel.getVisibleSummaryRows(businessId, branchId),
            BranchWideOfferModel.countBusinessBranches(businessId),
        ]);

        return {
            items: offers.map(mapEntry),
            summary: buildSummary(summaryRows, totalBranches),
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.max(1, Math.ceil(total / limit)),
            },
        };
    },

    async getOffer(requestor: Requestor, offerId: number): Promise<BranchWideOfferEntry> {
        const businessId = resolveBusinessId(requestor);
        const branchId = resolveBranchId(requestor);
        const offer = await getVisibleOfferOrThrow(offerId, businessId, branchId);

        return mapEntry(offer);
    },

    async getOptions(requestor: Requestor): Promise<BranchWideOfferOptionsResponse> {
        const businessId = resolveBusinessId(requestor);

        const products = await ProductModel.getProducts({
            where: { businessId },
            orderBy: { productName: "asc" },
        });

        return { products: products.map(mapProduct) };
    },

    async createOffer(requestor: Requestor, input: BranchWideOfferFormType): Promise<BranchWideOfferEntry> {
        const businessId = resolveBusinessId(requestor);
        const branchId = resolveBranchId(requestor);
        const normalized = normalizeInput(input);

        await assertProductsBelongToBusiness(businessId, normalized.products);

        const offer = await BranchWideOfferModel.createOffer({
            offerName: normalized.offerName,
            description: normalized.description,
            startDate: normalized.startDate,
            endDate: normalized.endDate,
            offerStatus: normalized.offerStatus,
            offerType: normalized.offerType,
            discountType: normalized.discountType,
            overallDiscountValue: normalized.overallDiscountValue,
            isExclusive: true,
            businessId,
            branchWideOfferBranches: { create: [{ branchId }] },
            branchWideOfferProducts: { create: toOfferProductRows(normalized.products) },
        });

        return mapEntry(offer);
    },

    async updateOffer(
        requestor: Requestor,
        offerId: number,
        input: BranchWideOfferFormType
    ): Promise<BranchWideOfferEntry> {
        const businessId = resolveBusinessId(requestor);
        const branchId = resolveBranchId(requestor);
        const existing = await getVisibleOfferOrThrow(offerId, businessId, branchId);

        const isBranchExclusive =
            existing.branchWideOfferBranches.length === 1 && existing.branchWideOfferBranches[0]?.branchId === branchId;

        if (!existing.isExclusive || !isBranchExclusive) {
            throw new HttpError(403, "You can only update offers exclusive to your branch");
        }

        const normalized = normalizeInput(input);
        await assertProductsBelongToBusiness(businessId, normalized.products);

        const data: BranchWideOfferUncheckedUpdateInput = {
            offerName: normalized.offerName,
            description: normalized.description,
            startDate: normalized.startDate,
            endDate: normalized.endDate,
            offerStatus: normalized.offerStatus,
            offerType: normalized.offerType,
            discountType: normalized.discountType,
            overallDiscountValue: normalized.overallDiscountValue,
            isExclusive: true,
        };

        const offer = await BranchWideOfferModel.updateOfferWithProducts(
            offerId,
            data,
            toOfferProductRows(normalized.products)
        );

        return mapEntry(offer);
    },

    async deleteOffer(requestor: Requestor, offerId: number): Promise<DeleteOfferResult> {
        const businessId = resolveBusinessId(requestor);
        const branchId = resolveBranchId(requestor);
        const existing = await getVisibleOfferOrThrow(offerId, businessId, branchId);

        const includesBranch = existing.branchWideOfferBranches.some(
            (association) => association.branchId === branchId
        );

        if (!existing.isExclusive || !includesBranch) {
            throw new HttpError(403, "All-branch offers cannot be modified from a branch");
        }

        await BranchWideOfferModel.detachBranch(offerId, branchId);

        const remainingBranches = await BranchWideOfferModel.countOfferBranches(offerId);

        if (remainingBranches > 0) {
            return { message: "Offer removed from this branch", deleted: false, archived: false };
        }

        const transactionItems = await BranchWideOfferModel.countTransactionItems(offerId);

        if (transactionItems > 0) {
            await BranchWideOfferModel.archiveOfferById(offerId);

            return { message: "Offer archived", deleted: false, archived: true };
        }

        await BranchWideOfferModel.deleteOfferById(offerId);

        return { message: "Offer deleted", deleted: true, archived: false };
    },

    parseOfferId(req: Request, res: Response): number | null {
        const offerId = Number(req.params.offerId);

        if (!Number.isInteger(offerId) || offerId <= 0) {
            res.status(404).json({ error: "Offer not found" });
            return null;
        }

        return offerId;
    },
};
