// BuyBuyin Shared Imports
import type {
    BranchWideOfferCountArgs,
    BranchWideOfferFindManyArgs,
    BranchWideOfferProductCreateManyInput,
    BranchWideOfferUncheckedCreateInput,
    BranchWideOfferUncheckedUpdateInput,
    BranchWideOfferWhereInput,
} from "@buybuyin/shared/prisma/models";
import type { BranchWideOfferStatusType } from "@buybuyin/shared/schema/branchWideOffer";

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

    async getOfferForBusiness(id: number, businessId: number) {
        return prisma.branchWideOffer.findFirst({
            where: { id, businessId },
            select: OFFER_SELECT,
        });
    },

    async createOffer(data: BranchWideOfferUncheckedCreateInput) {
        return prisma.branchWideOffer.create({ data, select: OFFER_SELECT });
    },

    async updateOfferWithBranchesAndProducts(
        id: number,
        data: BranchWideOfferUncheckedUpdateInput,
        branchIds: number[],
        products: Omit<BranchWideOfferProductCreateManyInput, "branchWideOfferId">[]
    ) {
        return prisma.$transaction(async (tx) => {
            await tx.branchWideOffer.update({ where: { id }, data });

            await tx.branchWideOfferBranch.deleteMany({ where: { branchWideOfferId: id } });

            if (branchIds.length > 0) {
                await tx.branchWideOfferBranch.createMany({
                    data: branchIds.map((branchId) => ({ branchId, branchWideOfferId: id })),
                });
            }

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

    async updateOfferStatus(id: number, offerStatus: BranchWideOfferStatusType) {
        return prisma.branchWideOffer.update({ where: { id }, data: { offerStatus }, select: OFFER_SELECT });
    },

    async detachAllBranches(offerId: number) {
        return prisma.branchWideOfferBranch.deleteMany({ where: { branchWideOfferId: offerId } });
    },

    async deleteOfferById(id: number) {
        return prisma.branchWideOffer.delete({ where: { id } });
    },

    async archiveOfferById(id: number) {
        return prisma.branchWideOffer.update({
            where: { id },
            data: { offerStatus: "DISABLED", isExclusive: true },
        });
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

    async getBusinessSummaryRows(businessId: number) {
        return prisma.branchWideOffer.findMany({
            where: { businessId },
            select: {
                offerStatus: true,
                startDate: true,
                endDate: true,
            },
        });
    },

    async getBranchesForBusiness(businessId: number) {
        return prisma.branch.findMany({
            where: { businessId },
            select: { id: true, location: true },
            orderBy: { location: "asc" },
        });
    },

    async getBranchForBusiness(branchId: number, businessId: number) {
        return prisma.branch.findFirst({
            where: { id: branchId, businessId },
            select: { id: true, location: true },
        });
    },

    async countBranchesForBusiness(businessId: number, branchIds: number[]) {
        return prisma.branch.count({ where: { businessId, id: { in: branchIds } } });
    },

    async countBusinessBranches(businessId: number) {
        return prisma.branch.count({ where: { businessId } });
    },
};
