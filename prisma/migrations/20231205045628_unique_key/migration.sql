-- AlterTable
ALTER TABLE `User` ADD COLUMN `bannedAt` TIMESTAMP(0) NULL;

-- CreateTable
CREATE TABLE `UserBanLog` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `reason` VARCHAR(250) NOT NULL,
    `userId` INTEGER NOT NULL,

    UNIQUE INDEX `UserBanLog_userId_key`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ArticleReportLog` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `articleId` INTEGER NOT NULL,
    `reporterId` INTEGER NOT NULL,
    `reason` VARCHAR(250) NOT NULL,
    `createdAt` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `reply` VARCHAR(191) NULL,
    `confirmedAt` TIMESTAMP(0) NULL,

    UNIQUE INDEX `ArticleReportLog_articleId_reporterId_key`(`articleId`, `reporterId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE INDEX `UserReportLog_reportedUserId_idx` ON `UserReportLog`(`reportedUserId`);

-- CreateIndex
CREATE INDEX `UserReportLog_reporterUserId_idx` ON `UserReportLog`(`reporterUserId`);

-- AddForeignKey
ALTER TABLE `UserReportLog` ADD CONSTRAINT `reporter` FOREIGN KEY (`reporterUserId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UserReportLog` ADD CONSTRAINT `reportedUser` FOREIGN KEY (`reportedUserId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UserBanLog` ADD CONSTRAINT `UserBanLog_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ArticleReportLog` ADD CONSTRAINT `ArticleReportLog_reporterId_fkey` FOREIGN KEY (`reporterId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
