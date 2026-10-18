/*
  Warnings:

  - You are about to drop the column `upDateTimedAt` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "upDateTimedAt",
ADD COLUMN     "updatedAt" TIMESTAMPTZ(0) NOT NULL DEFAULT CURRENT_TIMESTAMP;
