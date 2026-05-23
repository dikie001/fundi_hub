/*
  Warnings:

  - You are about to drop the column `isEmergency` on the `FundiProfile` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "FundiProfile" DROP COLUMN "isEmergency",
ADD COLUMN     "isAvailable" BOOLEAN NOT NULL DEFAULT true;
