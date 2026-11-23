// BuyBuyin Shared Imports
import type { BranchWideOffer } from "@buybuyin/shared/prisma/client";
import type { BranchWideOfferUncheckedCreateInput } from "@buybuyin/shared/prisma/models";

// ----------------------------- TYPES -----------------------------------------------------

export type SeededOfferSet = {
    allBranch: BranchWideOffer;
    branchOneExclusive: BranchWideOffer;
    branchTwoExclusive: BranchWideOffer;
    foreignOffer: BranchWideOffer;
};

// ----------------------------- FIXTURES --------------------------------------------------

export const buildMockOffer = (
    overrides: Partial<BranchWideOfferUncheckedCreateInput> = {}
): BranchWideOfferUncheckedCreateInput => ({
    offerName: "Sample Offer",
    description: "Sample offer description",
    startDate: new Date("2026-11-01T00:00:00.000Z"),
    endDate: new Date("2026-11-30T00:00:00.000Z"),
    offerStatus: "ENABLED",
    offerType: "OVERALL",
    discountType: "PERCENTAGE",
    overallDiscountValue: 10,
    ...overrides,
});
