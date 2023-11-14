/*
  Warnings:

  - A unique constraint covering the columns `[placeId]` on the table `Location` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `placeId` to the `Location` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX `Location_latitude_longitude_key` ON `Location`;

-- AlterTable
ALTER TABLE `Location` ADD COLUMN `placeId` VARCHAR(200) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Location_placeId_key` ON `Location`(`placeId`);
