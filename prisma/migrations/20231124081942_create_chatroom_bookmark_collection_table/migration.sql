/*
  Warnings:

  - The values [DELETED] on the enum `FriendInvite_status` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterTable
ALTER TABLE `FriendInvite` MODIFY `status` ENUM('PENDING', 'ACCEPTED') NOT NULL DEFAULT 'PENDING';

-- CreateTable
CREATE TABLE `ChatBookmarkCollection` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(200) NOT NULL,
    `roomId` VARCHAR(200) NOT NULL,
    `createdAt` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updatedAt` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `BookmarkChatBookmarkCollectionMap` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `collectionId` INTEGER NOT NULL,
    `bookmarkId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `BookmarkChatBookmarkCollectionMap` ADD CONSTRAINT `BookmarkChatBookmarkCollectionMap_collectionId_fkey` FOREIGN KEY (`collectionId`) REFERENCES `ChatBookmarkCollection`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `BookmarkChatBookmarkCollectionMap` ADD CONSTRAINT `BookmarkChatBookmarkCollectionMap_bookmarkId_fkey` FOREIGN KEY (`bookmarkId`) REFERENCES `Bookmark`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
