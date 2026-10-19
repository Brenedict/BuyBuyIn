/*
  Warnings:

  - You are about to drop the column `upDateTimedAt` on the `User` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "AccountStatusType" AS ENUM ('UNVERIFIED', 'ACTIVE', 'SUSPENDED', 'DEACTIVATED');

-- AlterTable
ALTER TABLE "User" DROP COLUMN "upDateTimedAt",
ADD COLUMN     "accountStatus" "AccountStatusType" NOT NULL DEFAULT 'UNVERIFIED',
ADD COLUMN     "updatedAt" TIMESTAMPTZ(0) NOT NULL DEFAULT CURRENT_TIMESTAMP;
