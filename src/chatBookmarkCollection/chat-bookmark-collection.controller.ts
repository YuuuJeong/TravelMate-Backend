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
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/strategies/jwt.strategy';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { User } from '@prisma/client';
import { CreateBookmarkDto } from 'src/bookmark/dtos/req/create-bookmark.dto';

@Controller()
@ApiTags('chat-bookmark-collection')
export class ChatBookmarkCollectionController {
  constructor(
    private readonly chatBookmarkCollection: ChatBookmarkCollectionService,
  ) {}

  @ApiOperation({
    summary: '채팅방에서 사용할 북마크 컬렉션 생성',
  })
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
  @Post('chat-room/bookmark-collection/:id/bookmarks')
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
    summary: '채팅방 북마크 컬렉션에 북마크 삭제하기',
  })
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Post('chat-room/bookmark-collection/:id/remove-bookmarks')
  deleteBookmarksInCollection(
    @Param('id') id: number,
    @Body('bookmarkIds') bookmarkIds: number[],
  ) {
    return this.chatBookmarkCollection.deleteBookmarksInCollection(
      id,
      bookmarkIds,
    );
  }

  @ApiOperation({
    summary:
      '채팅방내에서의 북마크 컬렉션 그리고 그 안에 있는 북마크들 정보 조회',
  })
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get('chat-room/:chatRoomId/bookmark-collection/details')
  fetchChatBookmarkCollection(@Param('chatRoomId') chatRoomId: string) {
    return this.chatBookmarkCollection.fetchChatBookmarkCollection(chatRoomId);
  }
}
