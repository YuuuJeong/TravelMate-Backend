-- AlterTable
ALTER TABLE `BookmarkCollection` MODIFY `visibility` ENUM('PRIVATE', 'FRIENDS_ONLY', 'PUBLIC', 'ALL') NOT NULL DEFAULT 'PRIVATE';

-- AlterTable
ALTER TABLE `Location` MODIFY `latitude` DECIMAL(65, 30) NOT NULL,
    MODIFY `longitude` DECIMAL(65, 30) NOT NULL;

-- CreateIndex
CREATE INDEX `index_tag_name` ON `tag`(`name`);
