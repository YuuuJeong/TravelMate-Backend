/*
  Warnings:

  - Added the required column `userId` to the `ArticleVersionHistory` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `ArticleVersionHistory` ADD COLUMN `userId` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `ArticleVersionHistory` ADD CONSTRAINT `ArticleVersionHistory_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
