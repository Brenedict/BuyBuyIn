-- CreateEnum
CREATE TYPE "PaymentStatusType" AS ENUM ('PENDING', 'PAID', 'FAILED', 'EXPIRED');

-- AlterTable
ALTER TABLE "Transaction" ADD COLUMN     "checkoutSessionId" TEXT,
ADD COLUMN     "paymentStatus" "PaymentStatusType" NOT NULL DEFAULT 'PENDING';
