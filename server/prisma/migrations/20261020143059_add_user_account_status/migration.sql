-- CreateEnum
CREATE TYPE "AccountStatusType" AS ENUM ('UNVERIFIED', 'ACTIVE', 'SUSPENDED', 'DEACTIVATED');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "accountStatus" "AccountStatusType" NOT NULL DEFAULT 'UNVERIFIED';
