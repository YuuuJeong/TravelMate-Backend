/*
  Warnings:

  - A unique constraint covering the columns `[collectionId,bookmarkId]` on the table `BookmarkChatBookmarkCollectionMap` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[roomId]` on the table `ChatBookmarkCollection` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `BookmarkChatBookmarkCollectionMap_collectionId_bookmarkId_key` ON `BookmarkChatBookmarkCollectionMap`(`collectionId`, `bookmarkId`);

-- CreateIndex
CREATE UNIQUE INDEX `ChatBookmarkCollection_roomId_key` ON `ChatBookmarkCollection`(`roomId`);
