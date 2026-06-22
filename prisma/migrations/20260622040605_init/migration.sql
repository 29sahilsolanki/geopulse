/*
  Warnings:

  - You are about to drop the column `radiusKm` on the `LocationPerimeter` table. All the data in the column will be lost.
  - Added the required column `radiusMetre` to the `LocationPerimeter` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "LocationPerimeter" DROP COLUMN "radiusKm",
ADD COLUMN     "radiusMetre" DOUBLE PRECISION NOT NULL;
