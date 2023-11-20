-- AddForeignKey
ALTER TABLE `ArticleBookmarkMap` ADD CONSTRAINT `ArticleBookmarkMap_articleId_fkey` FOREIGN KEY (`articleId`) REFERENCES `Article`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
