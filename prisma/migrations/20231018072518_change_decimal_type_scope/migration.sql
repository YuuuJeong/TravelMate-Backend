/*
  Warnings:

  - You are about to alter the column `latitude` on the `Location` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Decimal(65,3)`.
  - You are about to alter the column `longitude` on the `Location` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Decimal(65,3)`.

*/
-- AlterTable
ALTER TABLE `Bookmark` MODIFY `content` VARCHAR(200) NULL;

-- AlterTable
ALTER TABLE `Location` MODIFY `latitude` DECIMAL(65, 3) NOT NULL,
    MODIFY `longitude` DECIMAL(65, 3) NOT NULL;
