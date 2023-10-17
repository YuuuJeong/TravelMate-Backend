import { Module } from '@nestjs/common';
import { BookmarkCollectionController } from './bookmark-collection.controller';
import { BookmarkCollectionService } from './bookmark-collection.service';

@Module({
  imports: [],
  controllers: [BookmarkCollectionController],
  providers: [BookmarkCollectionService],
  exports: [BookmarkCollectionService],
})
export class BookmarkCollectionModule {}
