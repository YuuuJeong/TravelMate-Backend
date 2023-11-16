-- AlterTable
ALTER TABLE `PendingArticleRequest` ADD COLUMN `acceptedAt` TIMESTAMP(0) NULL,
    ADD COLUMN `decliendAt` TIMESTAMP(0) NULL;
