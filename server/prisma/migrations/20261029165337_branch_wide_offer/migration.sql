-- AlterEnum
BEGIN;
CREATE TYPE "DiscountType_new" AS ENUM ('PERCENTAGE', 'FIXED_VALUE');
ALTER TABLE "BranchWideOfferProduct" ALTER COLUMN "discountType" TYPE "DiscountType_new" USING ((CASE WHEN "discountType"::text = 'FIXEDVALUE' THEN 'FIXED_VALUE' ELSE "discountType"::text END)::"DiscountType_new");
ALTER TABLE "BranchWideOffer" ALTER COLUMN "discountType" TYPE "DiscountType_new" USING ((CASE WHEN "discountType"::text = 'FIXEDVALUE' THEN 'FIXED_VALUE' ELSE "discountType"::text END)::"DiscountType_new");
ALTER TYPE "DiscountType" RENAME TO "DiscountType_old";
ALTER TYPE "DiscountType_new" RENAME TO "DiscountType";
DROP TYPE "public"."DiscountType_old";
COMMIT;

-- DropForeignKey
ALTER TABLE "BranchWideOfferBranches" DROP CONSTRAINT "BranchWideOfferBranches_branchId_fkey";

-- DropForeignKey
ALTER TABLE "BranchWideOfferBranches" DROP CONSTRAINT "BranchWideOfferBranches_branchWideOfferId_fkey";

-- DropForeignKey
ALTER TABLE "BranchWideOfferProduct" DROP CONSTRAINT "BranchWideOfferProduct_branchWideOfferId_fkey";

-- DropForeignKey
ALTER TABLE "TransactionItem" DROP CONSTRAINT "TransactionItem_branchWideOfferId_fkey";

-- AlterTable
ALTER TABLE "BranchWideOffer" ADD COLUMN     "businessId" INTEGER,
ALTER COLUMN "offerName" SET DATA TYPE VARCHAR(256),
ALTER COLUMN "isExclusive" SET DEFAULT false,
ALTER COLUMN "discountType" DROP NOT NULL,
ALTER COLUMN "overallDiscountValue" DROP NOT NULL;

-- AlterTable
ALTER TABLE "TransactionItem" ALTER COLUMN "branchWideOfferId" DROP NOT NULL;

-- RenameTable
ALTER TABLE "BranchWideOfferBranches" RENAME TO "BranchWideOfferBranch";

-- RenameConstraint
ALTER TABLE "BranchWideOfferBranch" RENAME CONSTRAINT "BranchWideOfferBranches_pkey" TO "BranchWideOfferBranch_pkey";

-- CreateIndex
CREATE INDEX "BranchWideOfferBranch_branchWideOfferId_idx" ON "BranchWideOfferBranch"("branchWideOfferId");

-- CreateIndex
CREATE INDEX "BranchWideOffer_businessId_idx" ON "BranchWideOffer"("businessId");

-- CreateIndex
CREATE INDEX "BranchWideOffer_offerStatus_idx" ON "BranchWideOffer"("offerStatus");

-- CreateIndex
CREATE INDEX "BranchWideOffer_startDate_endDate_idx" ON "BranchWideOffer"("startDate", "endDate");

-- CreateIndex
CREATE INDEX "BranchWideOfferProduct_productId_idx" ON "BranchWideOfferProduct"("productId");

-- CreateIndex
CREATE INDEX "TransactionItem_branchWideOfferId_idx" ON "TransactionItem"("branchWideOfferId");

-- AddForeignKey
ALTER TABLE "TransactionItem" ADD CONSTRAINT "TransactionItem_branchWideOfferId_fkey" FOREIGN KEY ("branchWideOfferId") REFERENCES "BranchWideOffer"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BranchWideOfferProduct" ADD CONSTRAINT "BranchWideOfferProduct_branchWideOfferId_fkey" FOREIGN KEY ("branchWideOfferId") REFERENCES "BranchWideOffer"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BranchWideOffer" ADD CONSTRAINT "BranchWideOffer_businessId_fkey" FOREIGN KEY ("businessId") REFERENCES "Business"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BranchWideOfferBranch" ADD CONSTRAINT "BranchWideOfferBranch_branchId_fkey" FOREIGN KEY ("branchId") REFERENCES "Branch"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BranchWideOfferBranch" ADD CONSTRAINT "BranchWideOfferBranch_branchWideOfferId_fkey" FOREIGN KEY ("branchWideOfferId") REFERENCES "BranchWideOffer"("id") ON DELETE CASCADE ON UPDATE CASCADE;
