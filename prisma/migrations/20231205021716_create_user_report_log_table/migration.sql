-- CreateTable
CREATE TABLE `UserReportLog` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `reporterUserId` INTEGER NOT NULL,
    `reportedUserId` INTEGER NOT NULL,
    `reason` VARCHAR(191) NOT NULL,
    `createdAt` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `reply` VARCHAR(191) NULL,
    `confirmedAt` TIMESTAMP(0) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
