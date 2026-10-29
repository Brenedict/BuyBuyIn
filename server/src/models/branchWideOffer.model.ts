// BuyBuyin Shared Imports
import type {
    BranchWideOfferCountArgs,
    BranchWideOfferFindManyArgs,
    BranchWideOfferProductCreateManyInput,
    BranchWideOfferUncheckedCreateInput,
    BranchWideOfferUncheckedUpdateInput,
    BranchWideOfferWhereInput,
} from "@buybuyin/shared/prisma/models";

// Prisma.config
import prisma from "../config/prisma.config";

export const OFFER_SELECT = {
    id: true,
    offerName: true,
    description: true,
    startDate: true,
    endDate: true,
    isExclusive: true,
    offerStatus: true,
    offerType: true,
    discountType: true,
    overallDiscountValue: true,
    branchWideOfferBranches: {
        select: {
            branchId: true,
            branch: { select: { location: true } },
        },
        orderBy: { branchId: "asc" },
    },
    branchWideOfferProducts: {
        select: {
            productId: true,
            unitDiscountValue: true,
            requiredQuantity: true,
            discountType: true,
            product: { select: { productName: true, shelfPrice: true } },
        },
        orderBy: { product: { productName: "asc" } },
    },
} as const;

// ----------------------------- PRIVATE FUNCTIONS -----------------------------------------

const getVisibleWhere = (businessId: number, branchId: number): BranchWideOfferWhereInput => ({
    businessId,
    OR: [{ isExclusive: false }, { branchWideOfferBranches: { some: { branchId } } }],
});

// ----------------------------- PUBLIC FUNCTIONS ------------------------------------------

export default {
    OFFER_SELECT,
    getVisibleWhere,

    async getOffers(args?: BranchWideOfferFindManyArgs) {
        return prisma.branchWideOffer.findMany({ ...args, select: OFFER_SELECT });
    },

    async count(args?: BranchWideOfferCountArgs) {
        return prisma.branchWideOffer.count(args);
    },

    async getOfferById(id: number) {
        return prisma.branchWideOffer.findUnique({ where: { id }, select: OFFER_SELECT });
    },

    async getVisibleOffer(id: number, businessId: number, branchId: number) {
        return prisma.branchWideOffer.findFirst({
            where: { id, ...getVisibleWhere(businessId, branchId) },
            select: OFFER_SELECT,
        });
    },

    async createOffer(data: BranchWideOfferUncheckedCreateInput) {
        return prisma.branchWideOffer.create({ data, select: OFFER_SELECT });
    },

    async updateOfferWithProducts(
        id: number,
        data: BranchWideOfferUncheckedUpdateInput,
        products: Omit<BranchWideOfferProductCreateManyInput, "branchWideOfferId">[]
    ) {
        return prisma.$transaction(async (tx) => {
            await tx.branchWideOffer.update({ where: { id }, data });

            await tx.branchWideOfferProduct.deleteMany({ where: { branchWideOfferId: id } });

            if (products.length > 0) {
                await tx.branchWideOfferProduct.createMany({
                    data: products.map((product) => ({ ...product, branchWideOfferId: id })),
                });
            }

            return tx.branchWideOffer.findUniqueOrThrow({ where: { id }, select: OFFER_SELECT });
        });
    },

    async countTransactionItems(offerId: number) {
        return prisma.transactionItem.count({ where: { branchWideOfferId: offerId } });
    },

    async countOfferBranches(offerId: number) {
        return prisma.branchWideOfferBranch.count({ where: { branchWideOfferId: offerId } });
    },

    async detachBranch(offerId: number, branchId: number) {
        return prisma.branchWideOfferBranch.deleteMany({ where: { branchWideOfferId: offerId, branchId } });
    },

    async deleteOfferById(id: number) {
        return prisma.branchWideOffer.delete({ where: { id } });
    },

    async archiveOfferById(id: number) {
        return prisma.branchWideOffer.update({ where: { id }, data: { offerStatus: "DISABLED" } });
    },

    async getVisibleSummaryRows(businessId: number, branchId: number) {
        return prisma.branchWideOffer.findMany({
            where: getVisibleWhere(businessId, branchId),
            select: {
                offerStatus: true,
                startDate: true,
                endDate: true,
            },
        });
    },

    async countBusinessBranches(businessId: number) {
        return prisma.branch.count({ where: { businessId } });
    },
};
