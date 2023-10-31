/*
  Warnings:

  - You are about to drop the `BookmarksInCollection` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `userId` to the `Bookmark` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `BookmarksInCollection` DROP FOREIGN KEY `BookmarksInCollection_bookmarkId_fkey`;

-- DropForeignKey
ALTER TABLE `BookmarksInCollection` DROP FOREIGN KEY `BookmarksInCollection_collectionId_fkey`;

-- AlterTable
ALTER TABLE `Bookmark` ADD COLUMN `userId` INTEGER NOT NULL;

-- DropTable
DROP TABLE `BookmarksInCollection`;

-- CreateTable
CREATE TABLE `BookmarkBookmarkCollectionMap` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `collectionId` INTEGER NOT NULL,
    `bookmarkId` INTEGER NOT NULL,

    INDEX `BookmarksInCollection.fk_collectionId_idx`(`collectionId`),
    INDEX `BookmarksInCollection.fk_bookmarkId_idx`(`bookmarkId`),
    UNIQUE INDEX `BookmarkBookmarkCollectionMap_collectionId_bookmarkId_key`(`collectionId`, `bookmarkId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Bookmark` ADD CONSTRAINT `Bookmark_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `BookmarkBookmarkCollectionMap` ADD CONSTRAINT `BookmarkBookmarkCollectionMap_collectionId_fkey` FOREIGN KEY (`collectionId`) REFERENCES `BookmarkCollection`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `BookmarkBookmarkCollectionMap` ADD CONSTRAINT `BookmarkBookmarkCollectionMap_bookmarkId_fkey` FOREIGN KEY (`bookmarkId`) REFERENCES `Bookmark`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
