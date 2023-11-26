import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ChatBookmarkCollectionService } from './chat-bookmark-collection.service';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/strategies/jwt.strategy';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { User } from '@prisma/client';
import { BookmarkService } from 'src/bookmark/bookmark.service';
import { CreateBookmarkDto } from 'src/bookmark/dtos/req/create-bookmark.dto';

@Controller()
export class ChatBookmarkCollectionController {
  constructor(
    private readonly chatBookmarkCollection: ChatBookmarkCollectionService,
  ) {}

  @ApiOperation({
    summary: '채팅방에서 사용할 북마크 컬렉션 생성',
  })
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Post('chat-room/:chatRoomId/bookmark-collection')
  createChatBookmarkCollection(
    @Param('chatRoomId') chatRoomId: string,
    @Body('title') title: string,
  ) {
    return this.chatBookmarkCollection.createChatBookmarkCollection(
      title,
      chatRoomId,
    );
  }

  @ApiOperation({
    summary: '채팅방 북마크 컬렉션에 북마크 찍기',
  })
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Post('chat-bookmark-collection/:id/bookmarks')
  createBookmarksInCollection(
    @Param('id') id: number,
    @Body() dto: CreateBookmarkDto,
    @CurrentUser() user: User,
  ) {
    return this.chatBookmarkCollection.createBookmarksInCollection(
      id,
      dto,
      user.id,
    );
  }

  @ApiOperation({
    summary: '채팅방 북마크 컬렉션에 북마크 찍기',
  })
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Post('chat-bookmark-collection/:id/bookmarks')
  deleteBookmarksInCollection(
    @Param('id') id: number,
    @Body('bookmarkIds') bookmarkIds: number[],
  ) {
    return this.chatBookmarkCollection.deleteBookmarksInCollection(
      id,
      bookmarkIds,
    );
  }
}
