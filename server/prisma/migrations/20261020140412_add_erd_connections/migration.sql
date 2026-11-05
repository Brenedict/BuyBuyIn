/*
  Warnings:

  - You are about to drop the column `businessID` on the `Branch` table. All the data in the column will be lost.
  - You are about to drop the column `branchID` on the `BranchInventoryItem` table. All the data in the column will be lost.
  - You are about to drop the column `productID` on the `BranchInventoryItem` table. All the data in the column will be lost.
  - The primary key for the `BranchWideOfferBranches` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `BranchWideOfferBranches` table. All the data in the column will be lost.
  - The primary key for the `BranchWideOfferProduct` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `BranchWideOfferProduct` table. All the data in the column will be lost.
  - You are about to alter the column `name` on the `Business` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(256)`.
  - You are about to alter the column `location` on the `Business` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(256)`.
  - You are about to drop the column `businessID` on the `BusinessSubscription` table. All the data in the column will be lost.
  - You are about to drop the column `subscriptionID` on the `BusinessSubscription` table. All the data in the column will be lost.
  - You are about to drop the column `supplierID` on the `Product` table. All the data in the column will be lost.
  - The primary key for the `ProductCategory` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `ProductCategory` table. All the data in the column will be lost.
  - You are about to drop the column `contactInfo` on the `Supplier` table. All the data in the column will be lost.
  - You are about to drop the column `branchID` on the `Transaction` table. All the data in the column will be lost.
  - You are about to drop the column `userID` on the `Transaction` table. All the data in the column will be lost.
  - The `transactionId` column on the `TransactionItem` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Added the required column `branchWideOfferId` to the `BranchWideOfferBranches` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `branchId` on the `BranchWideOfferBranches` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Added the required column `branchWideOfferId` to the `BranchWideOfferProduct` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `productId` on the `BranchWideOfferProduct` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Added the required column `categoryId` to the `ProductCategory` table without a default value. This is not possible if the table is not empty.
  - Made the column `productId` on table `ProductCategory` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `address` to the `Supplier` table without a default value. This is not possible if the table is not empty.
  - Added the required column `contactNumber` to the `Supplier` table without a default value. This is not possible if the table is not empty.
  - Added the required column `contactPerson` to the `Supplier` table without a default value. This is not possible if the table is not empty.
  - Added the required column `email` to the `Supplier` table without a default value. This is not possible if the table is not empty.
  - Made the column `branchWideOfferId` on table `TransactionItem` required. This step will fail if there are existing NULL values in that column.
  - Made the column `productId` on table `TransactionItem` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Branch" DROP COLUMN "businessID",
ADD COLUMN     "businessId" INTEGER;

-- AlterTable
ALTER TABLE "BranchInventoryItem" DROP COLUMN "branchID",
DROP COLUMN "productID",
ADD COLUMN     "branchId" INTEGER,
ADD COLUMN     "productId" INTEGER;

-- AlterTable
ALTER TABLE "BranchWideOfferBranches" DROP CONSTRAINT "BranchWideOfferBranches_pkey",
DROP COLUMN "id",
ADD COLUMN     "branchWideOfferId" INTEGER NOT NULL,
DROP COLUMN "branchId",
ADD COLUMN     "branchId" INTEGER NOT NULL,
ADD CONSTRAINT "BranchWideOfferBranches_pkey" PRIMARY KEY ("branchId", "branchWideOfferId");

-- AlterTable
ALTER TABLE "BranchWideOfferProduct" DROP CONSTRAINT "BranchWideOfferProduct_pkey",
DROP COLUMN "id",
ADD COLUMN     "branchWideOfferId" INTEGER NOT NULL,
DROP COLUMN "productId",
ADD COLUMN     "productId" INTEGER NOT NULL,
ADD CONSTRAINT "BranchWideOfferProduct_pkey" PRIMARY KEY ("branchWideOfferId", "productId");

-- AlterTable
ALTER TABLE "Business" ALTER COLUMN "name" SET DATA TYPE VARCHAR(256),
ALTER COLUMN "location" SET DATA TYPE VARCHAR(256);

-- AlterTable
ALTER TABLE "BusinessSubscription" DROP COLUMN "businessID",
DROP COLUMN "subscriptionID",
ADD COLUMN     "businessId" INTEGER,
ADD COLUMN     "subscriptionId" INTEGER;

-- AlterTable
ALTER TABLE "Product" DROP COLUMN "supplierID",
ADD COLUMN     "supplierId" INTEGER;

-- AlterTable
ALTER TABLE "ProductCategory" DROP CONSTRAINT "ProductCategory_pkey",
DROP COLUMN "id",
ADD COLUMN     "categoryId" INTEGER NOT NULL,
ALTER COLUMN "productId" SET NOT NULL,
ADD CONSTRAINT "ProductCategory_pkey" PRIMARY KEY ("categoryId", "productId");

-- AlterTable
ALTER TABLE "Supplier" DROP COLUMN "contactInfo",
ADD COLUMN     "address" TEXT NOT NULL,
ADD COLUMN     "contactNumber" VARCHAR(11) NOT NULL,
ADD COLUMN     "contactPerson" TEXT NOT NULL,
ADD COLUMN     "email" VARCHAR(256) NOT NULL;

-- AlterTable
ALTER TABLE "Transaction" DROP COLUMN "branchID",
DROP COLUMN "userID",
ADD COLUMN     "branchId" INTEGER,
ADD COLUMN     "userId" INTEGER;

-- AlterTable
ALTER TABLE "TransactionItem" DROP COLUMN "transactionId",
ADD COLUMN     "transactionId" INTEGER,
ALTER COLUMN "branchWideOfferId" SET NOT NULL,
ALTER COLUMN "productId" SET NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "branchId" INTEGER,
ADD COLUMN     "businessId" INTEGER;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_businessId_fkey" FOREIGN KEY ("businessId") REFERENCES "Business"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_branchId_fkey" FOREIGN KEY ("branchId") REFERENCES "Branch"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BusinessSubscription" ADD CONSTRAINT "BusinessSubscription_subscriptionId_fkey" FOREIGN KEY ("subscriptionId") REFERENCES "Subscription"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BusinessSubscription" ADD CONSTRAINT "BusinessSubscription_businessId_fkey" FOREIGN KEY ("businessId") REFERENCES "Business"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Branch" ADD CONSTRAINT "Branch_businessId_fkey" FOREIGN KEY ("businessId") REFERENCES "Business"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BranchInventoryItem" ADD CONSTRAINT "BranchInventoryItem_branchId_fkey" FOREIGN KEY ("branchId") REFERENCES "Branch"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BranchInventoryItem" ADD CONSTRAINT "BranchInventoryItem_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_branchId_fkey" FOREIGN KEY ("branchId") REFERENCES "Branch"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_supplierId_fkey" FOREIGN KEY ("supplierId") REFERENCES "Supplier"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TransactionItem" ADD CONSTRAINT "TransactionItem_transactionId_fkey" FOREIGN KEY ("transactionId") REFERENCES "Transaction"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TransactionItem" ADD CONSTRAINT "TransactionItem_branchWideOfferId_fkey" FOREIGN KEY ("branchWideOfferId") REFERENCES "BranchWideOffer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TransactionItem" ADD CONSTRAINT "TransactionItem_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductCategory" ADD CONSTRAINT "ProductCategory_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductCategory" ADD CONSTRAINT "ProductCategory_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BranchWideOfferProduct" ADD CONSTRAINT "BranchWideOfferProduct_branchWideOfferId_fkey" FOREIGN KEY ("branchWideOfferId") REFERENCES "BranchWideOffer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BranchWideOfferProduct" ADD CONSTRAINT "BranchWideOfferProduct_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BranchWideOfferBranches" ADD CONSTRAINT "BranchWideOfferBranches_branchId_fkey" FOREIGN KEY ("branchId") REFERENCES "Branch"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BranchWideOfferBranches" ADD CONSTRAINT "BranchWideOfferBranches_branchWideOfferId_fkey" FOREIGN KEY ("branchWideOfferId") REFERENCES "BranchWideOffer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
