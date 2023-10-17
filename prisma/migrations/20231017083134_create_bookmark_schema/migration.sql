-- CreateTable
CREATE TABLE `Bookmark` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `content` VARCHAR(200) NOT NULL,
    `latitude` DECIMAL(65, 30) NOT NULL,
    `longitude` DECIMAL(65, 30) NOT NULL,

    UNIQUE INDEX `Bookmark_latitude_longitude_key`(`latitude`, `longitude`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `BookmarkCollection` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(200) NOT NULL,
    `visibility` ENUM('PRIVATE', 'FRIENDS_ONLY', 'PUBLIC') NOT NULL DEFAULT 'PRIVATE',
    `createdAt` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updatedAt` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0) ON UPDATE CURRENT_TIMESTAMP(0),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_BookmarkToBookmarkCollection` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_BookmarkToBookmarkCollection_AB_unique`(`A`, `B`),
    INDEX `_BookmarkToBookmarkCollection_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `_BookmarkToBookmarkCollection` ADD CONSTRAINT `_BookmarkToBookmarkCollection_A_fkey` FOREIGN KEY (`A`) REFERENCES `Bookmark`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_BookmarkToBookmarkCollection` ADD CONSTRAINT `_BookmarkToBookmarkCollection_B_fkey` FOREIGN KEY (`B`) REFERENCES `BookmarkCollection`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
