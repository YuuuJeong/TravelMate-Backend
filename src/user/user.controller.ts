import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import {
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { BookmarkService } from 'src/bookmark/bookmark.service';
import { BookmarkCollectionService } from 'src/bookmarkCollection/bookmark-collection.service';
import { BookmarkCollectionDto } from 'src/bookmarkCollection/dtos/bookmark-collection.dto';
import { UpdateBookmarkCollectionRequestDTO } from 'src/bookmarkCollection/dtos/req/update-bookmark-collection.dto';
import { CreateBookmarkCollectionRequestDTO } from '../bookmarkCollection/dtos/req/create-bookmark-collection.dto';
import { BookmarkDto } from '../bookmark/dtos/bookmark.dto';
import { UserService } from 'src/user/user.service';
import { UserNicknameDto } from './dtos/req/user-nickname.dto';

@Controller('users')
@ApiTags('users')
export class UserController {
  constructor(
    private readonly bookmarkCollection: BookmarkCollectionService,
    private readonly bookmark: BookmarkService,
    private readonly userService: UserService,
  ) {}

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
    type: BookmarkCollectionDto,
    description: '북마크 컬렉션 생성완료',
  })
  @Post('/me/bookmark-collection')
  async createBookmarkCollection(
    @Body() dto: CreateBookmarkCollectionRequestDTO,
  ): Promise<BookmarkCollectionDto> {
    return await this.bookmarkCollection.createBookmarkCollection(dto);
  }

  @ApiOperation({
    summary: '북마크 컬렉션 삭제 API',
    description: '유저의 북마크 컬렉션을 삭제한다.',
  })
  //TODO: 로그인 및 회원가입 구현후 ApiBearerAuth 추가
  @ApiParam({
    name: 'id',
    type: Number,
    required: true,
  })
  @ApiResponse({
    status: 200,
    type: BookmarkCollectionDto,
    description: '북마크 컬렉션 삭제완료',
  })
  @Delete('me/bookmark-collection/:id')
  async removeBookmarkCollection(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<BookmarkCollectionDto> {
    return await this.bookmarkCollection.removeBookmarkCollection(id);
  }

  @ApiResponse({
    status: 200,
    type: BookmarkCollectionDto,
    isArray: true,
    description: '북마크 컬렉션 조회완료',
  })
  @Get('me/bookmark-collections')
  async fetchBookmarkCollections(): Promise<BookmarkCollectionDto[]> {
    return await this.bookmarkCollection.fetchBookmarkCollections();
  }

  @ApiOperation({
    summary: '북마크 컬렉션 수정 API',
    description: '유저의 북마크 컬렉션을 수정한다.',
  })
  //TODO: 로그인 및 회원가입 구현후 ApiBearerAuth 추가
  @ApiParam({
    name: 'id',
    type: Number,
    required: true,
  })
  @ApiResponse({
    status: 200,
    type: BookmarkCollectionDto,
    description: '북마크 컬렉션 수정완료',
  })
  @Patch('me/bookmark-collection/:id')
  async updateBookmarkCollection(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateBookmarkCollectionRequestDTO,
  ): Promise<BookmarkCollectionDto> {
    return await this.bookmarkCollection.updateBookmarkCollection(id, dto);
  }

  @ApiOperation({
    summary: '북마크 컬렉션안에 있는 북마크들 조회 API',
    description: '북마크 컬렉션안에 있는 북마크들 조회한다.',
  })
  @ApiParam({
    name: 'id',
    type: Number,
    required: true,
  })
  @ApiResponse({
    status: 200,
    type: BookmarkDto,
    isArray: true,
    description: '북마크 컬렉션안에 있는 북마크들 조회완료',
  })
  @Get('me/bookmark-collection/:id/bookmarks')
  async fetchBookmarksInBookmarkCollection(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<BookmarkDto[]> {
    return await this.bookmark.getBookmarksInCollection(id);
  }

  @ApiOperation({
    summary: '닉네임 중복확인 API',
    description: '닉네임 변경하기 전에 닉네임 중복여부를 확인한다.',
  })
  @ApiBody({
    required: true,
    type: VerifyIsValidNicknameDto,
  })
  @ApiResponse({
    status: 201,
    type: String,
    description: '닉네임 중복확인 성공',
  })
  @Post('verify-nickname')
  async verifyIsValidNickname(@Body() dto: UserNicknameDto): Promise<string> {
    return this.userService.verifyIsValidNickname(dto.nickname);
  }

  @ApiOperation({
    summary: '닉네임 변경 API',
    description: '유저 닉네임을 변경한다.',
  })
  @ApiBody({
    required: true,
    type: UserNicknameDto,
  })
  @ApiResponse({
    status: 201,
    description: '닉네임 변경 완료',
  })
  @Patch('change-nickname')
  async changeUserNickname(@Body() dto: UserNicknameDto): Promise<string> {
    const userId = 1; //TODO: 추후 수정
    return this.userService.changeUserNickname(dto.nickname, userId);
  }
}
