/*
  Warnings:

  - You are about to drop the column `upDateTimedAt` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `username` on the `User` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "User_username_key";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "upDateTimedAt",
DROP COLUMN "username",
ADD COLUMN     "updatedAt" TIMESTAMPTZ(0) NOT NULL DEFAULT CURRENT_TIMESTAMP;
