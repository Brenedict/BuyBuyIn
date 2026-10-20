-- CreateEnum
CREATE TYPE "PaymentStatusType" AS ENUM ('PENDING', 'PAID', 'FAILED', 'EXPIRED');

-- AlterTable
ALTER TABLE "Transaction"
ADD COLUMN "paymentStatus" "PaymentStatusType",
ADD COLUMN "checkoutSessionId" TEXT;