import { Module } from '@nestjs/common';
import { BookmarkController } from './bookmark.controller';
import { BookmarkService } from './bookmark.service';
import { BookmarkCollectionService } from 'src/bookmarkCollection/bookmark-collection.service';

@Module({
  imports: [],
  controllers: [BookmarkController],
  providers: [BookmarkService, BookmarkCollectionService],
  exports: [BookmarkService],
})
export class BookmarkModule {}
