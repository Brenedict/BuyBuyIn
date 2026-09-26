/*
  Warnings:

  - You are about to drop the column `updatedAt` on the `User` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[resetToken]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "PackageType" AS ENUM ('BASIC', 'PRO', 'ENTERPRISE');

-- CreateEnum
CREATE TYPE "RoleType" AS ENUM ('SUPERADMIN', 'HQADMIN', 'BRANCHMANAGER', 'CASHIER');

-- CreateEnum
CREATE TYPE "PaymentMethodType" AS ENUM ('CASH', 'ECASH', 'CARD');

-- CreateEnum
CREATE TYPE "TransactionStatusType" AS ENUM ('VOID', 'COMPLETE', 'REFUNDED');

-- CreateEnum
CREATE TYPE "OfferStatusType" AS ENUM ('ENABLED', 'DISABLED', 'DRAFT');

-- CreateEnum
CREATE TYPE "OfferType" AS ENUM ('OVERALL', 'INDIVIDUAL');

-- CreateEnum
CREATE TYPE "DiscountType" AS ENUM ('PERCENTAGE', 'FIXEDVALUE');

-- AlterTable
ALTER TABLE "User" DROP COLUMN "updatedAt",
ADD COLUMN     "resetToken" TEXT,
ADD COLUMN     "resetTokenExpiresAt" TIMESTAMP(3),
ADD COLUMN     "role" "RoleType" NOT NULL DEFAULT 'CASHIER',
ADD COLUMN     "upDateTimedAt" TIMESTAMPTZ(0) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- CreateTable
CREATE TABLE "Subscription" (
    "id" SERIAL NOT NULL,
    "packageType" "PackageType" NOT NULL,
    "packageName" TEXT NOT NULL,
    "numberBranches" INTEGER NOT NULL,
    "baseCost" DOUBLE PRECISION NOT NULL,
    "baseAccountLimit" INTEGER NOT NULL,
    "duration" INTEGER NOT NULL,

    CONSTRAINT "Subscription_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BusinessSubscription" (
    "id" SERIAL NOT NULL,
    "subscriptionID" TEXT NOT NULL,
    "businessID" TEXT NOT NULL,
    "dateApplied" TIMESTAMP(3) NOT NULL,
    "additionalBranches" INTEGER NOT NULL,
    "totalCost" DOUBLE PRECISION NOT NULL,
    "totalAccountLimit" INTEGER NOT NULL,

    CONSTRAINT "BusinessSubscription_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Business" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "location" TEXT NOT NULL,

    CONSTRAINT "Business_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Branch" (
    "id" SERIAL NOT NULL,
    "businessID" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "accountLimit" INTEGER NOT NULL,

    CONSTRAINT "Branch_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BranchInventoryItem" (
    "id" SERIAL NOT NULL,
    "productID" TEXT NOT NULL,
    "branchID" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "reorderThreshold" INTEGER NOT NULL,

    CONSTRAINT "BranchInventoryItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Transaction" (
    "id" SERIAL NOT NULL,
    "branchID" TEXT NOT NULL,
    "userID" TEXT NOT NULL,
    "totalPrice" DOUBLE PRECISION NOT NULL,
    "dateofTransaction" TIMESTAMP(3) NOT NULL,
    "paymentMethod" "PaymentMethodType" NOT NULL,
    "status" "TransactionStatusType" NOT NULL,
    "discount" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "Transaction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Product" (
    "id" SERIAL NOT NULL,
    "supplierID" TEXT NOT NULL,
    "productName" TEXT NOT NULL,
    "basePrice" DOUBLE PRECISION NOT NULL,
    "shelfPrice" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "Product_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TransactionItem" (
    "id" SERIAL NOT NULL,
    "transactionId" TEXT NOT NULL,
    "branchWideOfferId" INTEGER,
    "productId" INTEGER,
    "quantity" INTEGER NOT NULL,
    "currentPrice" DOUBLE PRECISION NOT NULL,
    "isBundle" BOOLEAN NOT NULL,

    CONSTRAINT "TransactionItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Supplier" (
    "id" SERIAL NOT NULL,
    "supplierName" TEXT NOT NULL,
    "contactInfo" TEXT NOT NULL,

    CONSTRAINT "Supplier_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProductCategory" (
    "id" SERIAL NOT NULL,
    "productId" INTEGER,

    CONSTRAINT "ProductCategory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Category" (
    "id" SERIAL NOT NULL,
    "categoryName" TEXT NOT NULL,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BranchWideOfferProduct" (
    "id" SERIAL NOT NULL,
    "productId" TEXT NOT NULL,
    "unitDiscountValue" DOUBLE PRECISION NOT NULL,
    "requiredQuantity" INTEGER NOT NULL,
    "discountType" "DiscountType" NOT NULL,

    CONSTRAINT "BranchWideOfferProduct_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BranchWideOffer" (
    "id" SERIAL NOT NULL,
    "offerName" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "isExclusive" BOOLEAN NOT NULL,
    "offerStatus" "OfferStatusType" NOT NULL,
    "offerType" "OfferType" NOT NULL,
    "discountType" "DiscountType" NOT NULL,
    "overallDiscountValue" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "BranchWideOffer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BranchWideOfferBranches" (
    "id" SERIAL NOT NULL,
    "branchId" TEXT NOT NULL,

    CONSTRAINT "BranchWideOfferBranches_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_resetToken_key" ON "User"("resetToken");
