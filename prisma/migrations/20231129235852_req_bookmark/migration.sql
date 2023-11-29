-- CreateTable
CREATE TABLE `PendingArticleRequestBookmarkMap` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `pendingArticleRequestId` INTEGER NOT NULL,
    `bookmarkId` INTEGER NOT NULL,

    UNIQUE INDEX `PendingArticleRequestBookmarkMap_pendingArticleRequestId_boo_key`(`pendingArticleRequestId`, `bookmarkId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `PendingArticleRequestBookmarkMap` ADD CONSTRAINT `PendingArticleRequestBookmarkMap_pendingArticleRequestId_fkey` FOREIGN KEY (`pendingArticleRequestId`) REFERENCES `PendingArticleRequest`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PendingArticleRequestBookmarkMap` ADD CONSTRAINT `PendingArticleRequestBookmarkMap_bookmarkId_fkey` FOREIGN KEY (`bookmarkId`) REFERENCES `Bookmark`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
