-- AlterTable
ALTER TABLE `User` MODIFY `createdAt` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    MODIFY `updatedAt` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0);

-- CreateTable
CREATE TABLE `Location` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `latitude` DECIMAL(65, 3) NOT NULL,
    `longitude` DECIMAL(65, 3) NOT NULL,

    UNIQUE INDEX `Location_latitude_longitude_key`(`latitude`, `longitude`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Bookmark` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `content` VARCHAR(200) NULL,
    `locationId` INTEGER NOT NULL,
    `createdAt` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `deletedAt` TIMESTAMP(0) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `BookmarksInCollection` (
    `collectionId` INTEGER NOT NULL,
    `bookmarkId` INTEGER NOT NULL,

    INDEX `BookmarksInCollection.fk_collectionId_idx`(`collectionId`),
    INDEX `BookmarksInCollection.fk_bookmarkId_idx`(`bookmarkId`),
    PRIMARY KEY (`collectionId`, `bookmarkId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `BookmarkCollection` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(200) NOT NULL,
    `userId` INTEGER NOT NULL,
    `visibility` ENUM('PRIVATE', 'FRIENDS_ONLY', 'PUBLIC') NOT NULL DEFAULT 'PRIVATE',
    `createdAt` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updatedAt` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `fk_BookmarkCollection_userId`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Bookmark` ADD CONSTRAINT `Bookmark_locationId_fkey` FOREIGN KEY (`locationId`) REFERENCES `Location`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `BookmarksInCollection` ADD CONSTRAINT `BookmarksInCollection_collectionId_fkey` FOREIGN KEY (`collectionId`) REFERENCES `BookmarkCollection`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `BookmarksInCollection` ADD CONSTRAINT `BookmarksInCollection_bookmarkId_fkey` FOREIGN KEY (`bookmarkId`) REFERENCES `Bookmark`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `BookmarkCollection` ADD CONSTRAINT `BookmarkCollection_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
