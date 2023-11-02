/*
  Warnings:

  - You are about to drop the column `profileImg` on the `User` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[profileImageId]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `type` to the `Attachment` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Attachment` ADD COLUMN `type` ENUM('ARTICLE') NOT NULL;

-- AlterTable
ALTER TABLE `User` DROP COLUMN `profileImg`,
    ADD COLUMN `profileImageId` INTEGER NULL;

-- CreateTable
CREATE TABLE `ProfileImage` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `state` VARCHAR(10) NOT NULL,
    `bucket` VARCHAR(64) NOT NULL,
    `type` ENUM('ARTICLE') NOT NULL,
    `created_at` TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `User_profileImageId_key` ON `User`(`profileImageId`);

-- AddForeignKey
ALTER TABLE `User` ADD CONSTRAINT `User_profileImageId_fkey` FOREIGN KEY (`profileImageId`) REFERENCES `ProfileImage`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
