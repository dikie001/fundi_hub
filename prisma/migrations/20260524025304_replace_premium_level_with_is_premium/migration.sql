/*
  Warnings:

  - You are about to drop the column `premiumLevel` on the `FundiProfile` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "FundiProfile" DROP COLUMN "premiumLevel",
ADD COLUMN     "isPremium" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "isRegistrationPaid" BOOLEAN NOT NULL DEFAULT false;

-- DropEnum
DROP TYPE "PremiumLevel";
