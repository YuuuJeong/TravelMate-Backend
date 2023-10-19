import { Module } from '@nestjs/common';
import { BookmarkCollectionController } from './bookmark-collection.controller';
import { BookmarkCollectionService } from './bookmark-collection.service';
import { PrismaService } from 'src/prisma.service';

@Module({
  imports: [],
  controllers: [BookmarkCollectionController],
  providers: [BookmarkCollectionService, PrismaService],
  exports: [BookmarkCollectionService],
})
export class BookmarkCollectionModule {}
