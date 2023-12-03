/*
  Warnings:

  - Made the column `content` on table `Bookmark` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `Bookmark` MODIFY `content` VARCHAR(200) NOT NULL;
