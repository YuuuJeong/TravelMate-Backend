-- AlterTable
ALTER TABLE `Attachment` MODIFY `type` ENUM('ARTICLE', 'THUMBNAIL', 'CHAT') NOT NULL;

-- AddForeignKey
ALTER TABLE `ArticleReportLog` ADD CONSTRAINT `ArticleReportLog_articleId_fkey` FOREIGN KEY (`articleId`) REFERENCES `Article`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
