/*
  Warnings:

  - You are about to drop the column `phoneNumber` on the `User` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[providerId]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `User` DROP COLUMN `phoneNumber`,
    MODIFY `nickname` VARCHAR(191) NULL;

-- CreateIndex
CREATE UNIQUE INDEX `User_providerId_key` ON `User`(`providerId`);
