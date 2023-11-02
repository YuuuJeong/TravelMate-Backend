-- CreateTable
CREATE TABLE `Attachment` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `state` VARCHAR(10) NOT NULL,
    `bucket` VARCHAR(64) NOT NULL,
    `articleID` INTEGER NULL,
    `userId` INTEGER NULL,
    `created_at` TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE INDEX `fk_ArticleBookmarkMap_period` ON `ArticleBookmarkMap`(`period`);

-- AddForeignKey
ALTER TABLE `Attachment` ADD CONSTRAINT `Attachment_articleID_fkey` FOREIGN KEY (`articleID`) REFERENCES `Article`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Attachment` ADD CONSTRAINT `Attachment_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
