-- AlterTable
ALTER TABLE "Supplier" ADD COLUMN     "businessId" INTEGER;

-- CreateIndex
CREATE INDEX "Supplier_businessId_idx" ON "Supplier"("businessId");

-- AddForeignKey
ALTER TABLE "Supplier" ADD CONSTRAINT "Supplier_businessId_fkey" FOREIGN KEY ("businessId") REFERENCES "Business"("id") ON DELETE SET NULL ON UPDATE CASCADE;


UPDATE "Supplier" AS s
SET "businessId" = pb."businessId"
FROM (
    SELECT DISTINCT ON ("supplierId") "supplierId", "businessId"
    FROM "Product"
    WHERE "supplierId" IS NOT NULL AND "businessId" IS NOT NULL
    ORDER BY "supplierId", "businessId"
) AS pb
WHERE s."id" = pb."supplierId" AND s."businessId" IS NULL;
