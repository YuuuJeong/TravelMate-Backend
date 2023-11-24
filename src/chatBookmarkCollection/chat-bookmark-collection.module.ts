import { Module } from '@nestjs/common';
import { ChatBookmarkCollectionController } from './chat-bookmark-collection.controller';
import { PrismaService } from 'src/prisma.service';

@Module({
  imports: [],
  controllers: [ChatBookmarkCollectionController],
  providers: [PrismaService],
})
export class ChatBookmarkCollectionModule {}
