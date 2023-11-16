/*
  Warnings:

  - You are about to drop the column `decliendAt` on the `PendingArticleRequest` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `PendingArticleRequest` DROP COLUMN `decliendAt`,
    ADD COLUMN `declinedAt` TIMESTAMP(0) NULL;
