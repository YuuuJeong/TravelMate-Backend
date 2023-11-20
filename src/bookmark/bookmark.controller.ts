import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { BookmarkService } from './bookmark.service';
import { LocationWithContent } from 'src/bookmarkCollection/dtos/req/update-bookmark-collection.dto';
import { JwtAuthGuard } from 'src/auth/strategies/jwt.strategy';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { User } from '@prisma/client';

@Controller('')
@ApiTags('bookmark')
export class BookmarkController {
  constructor(private readonly bookmark: BookmarkService) {}

  @ApiOperation({
    summary: '북만크 생성',
  })
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Post('/bookmark')
  createBookmark(@CurrentUser() user: User, @Body() dto: LocationWithContent) {
    return this.bookmark.createBookmark(user.id, dto);
  }
}
