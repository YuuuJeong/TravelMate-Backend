import { Module } from '@nestjs/common';
import { ChatBookmarkCollectionController } from './chat-bookmark-collection.controller';
import { PrismaService } from 'src/prisma.service';
import { BookmarkModule } from 'src/bookmark/bookmark.module';
import { ChatBookmarkCollectionService } from './chat-bookmark-collection.service';

@Module({
  imports: [BookmarkModule],
  controllers: [ChatBookmarkCollectionController],
  providers: [PrismaService, ChatBookmarkCollectionService],
})
export class ChatBookmarkCollectionModule {}
