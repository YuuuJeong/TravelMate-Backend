import { Body, Controller, Post } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { BookmarkCollectionService } from 'src/bookmarkCollection/bookmark-collection.service';
import { CreateBookmarkCollectionRequestDTO } from '../bookmarkCollection/dtos/req/create-bookmark-collection.dto';

@Controller('users')
@ApiTags('users')
export class UserController {
  constructor(private readonly bookmarkCollection: BookmarkCollectionService) {}

  @ApiOperation({
    summary: '북마크 컬렉션 생성 API',
    description: '제목, 공개여부를 선택하여 유저의 북마크 컬렉션을 생성한다.',
  })
  //TODO: 로그인 및 회원가입 구현후 ApiBearerAuth 추가
  @ApiBody({
    type: CreateBookmarkCollectionRequestDTO,
    required: true,
  })
  @ApiResponse({
    status: 200,
    description: '북마크 컬렉션 생성완료',
  })
  @Post('/me/bookmark-collection')
  async createBookmarkCollection(
    @Body() dto: CreateBookmarkCollectionRequestDTO,
  ) {
    return await this.bookmarkCollection.createBookmarkCollection(dto);
  }
}
