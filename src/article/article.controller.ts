import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { ArticleService } from './article.service';
import { JwtAuthGuard } from 'src/auth/strategies/jwt.strategy';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { Period, User } from '@prisma/client';
import { CreateArticleDto, Location } from './dtos/create-article.dto';
import { GetArticlesDto } from './dtos/get-articles.dto';
import { UpdateArticleDto } from './dtos/update-article.dto';
import { RequestArticleDto } from './dtos/request-article.dto';
import { ShowRequestsDto } from './dtos/show-requests.dto';

@Controller('articles')
@ApiTags('articles')
export class ArticleController {
  constructor(private readonly articleService: ArticleService) {}

  @ApiOperation({
    summary: 'Create Article',
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post()
  createArticle(@CurrentUser() user: User, @Body() dto: CreateArticleDto) {
    return this.articleService.createArticle(user, dto);
  }

  @ApiOperation({
    summary: 'Get Article list',
  })
  @Get()
  getArticles(@Query() dto: GetArticlesDto) {
    return this.articleService.getArticles(dto);
  }

  @ApiOperation({
    summary: 'Get Articles count',
  })
  @ApiQuery({
    name: 'period',
    enum: Period,
    isArray: true,
    required: false,
  })
  @ApiQuery({
    name: 'location',
    enum: Location,
    required: false,
  })
  @Get('/count')
  getArticlesCount(
    @Query() filter: Pick<GetArticlesDto, 'period' | 'location'>,
  ) {
    return this.articleService.getArticlesCount(filter);
  }

  @ApiOperation({
    summary: 'Get Article',
  })
  @Get('/:articleId')
  getArticle(@Param('articleId') articleId: number) {
    return this.articleService.getArticle(articleId);
  }

  @ApiOperation({
    summary: 'Update article',
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Patch('/:articleId')
  updateArticle(
    @CurrentUser() user: User,
    @Param('articleId') articleId: number,
    @Body() dto: UpdateArticleDto,
  ) {
    return this.articleService.updateArticle(user.id, articleId, dto);
  }

  @ApiOperation({
    summary: 'Delete article',
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Delete(':articleId')
  deleteArticle(
    @CurrentUser() user: User,
    @Param('articleId') articleId: number,
  ) {
    return this.articleService.deleteArticle(user.id, articleId);
  }

  @ApiOperation({
    description: 'Request article',
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post('/:articleId/reqeusts')
  requestArticle(
    @CurrentUser() user: User,
    @Param('articleId') articleId: number,
    @Body() dto: RequestArticleDto,
  ) {
    return this.articleService.requestArticle(user.id, articleId, dto);
  }

  @ApiOperation({
    summary: 'Accept update requests',
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('/:articleId/reqeusts/accept/:requestId')
  acceptRequest(
    @CurrentUser() user: User,
    @Param('articleId') articleId: number,
    @Param('requestId') requestId: number,
  ) {
    return this.articleService.acceptRequest(user.id, articleId, requestId);
  }

  @ApiOperation({
    summary: 'Decline update requests',
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('/:articleId/reqeusts/decline/:requestId')
  declineRequest(
    @CurrentUser() user: User,
    @Param('articleId') articleId: number,
    @Param('requestId') requestId: number,
  ) {
    return this.articleService.declineRequest(user.id, articleId, requestId);
  }

  @ApiOperation({
    summary: 'Show update requests',
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('/:articleId/reqeusts')
  showRequests(
    @CurrentUser() user: User,
    @Param('articleId') articleId: number,
    @Query() dto: ShowRequestsDto,
  ) {
    return this.articleService.showRequests(user.id, articleId, dto.period);
  }

  @ApiOperation({
    summary: 'Get update single request',
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('/:articleId/reqeusts/:requestId')
  getRequest(
    @CurrentUser() user: User,
    @Param('articleId') articleId: number,
    @Param('requestId') requestId: number,
  ) {
    return this.articleService.getRequest(user.id, articleId, requestId);
  }

  @ApiOperation({
    summary: 'Add post to favorites',
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post('/:articleId/favorite')
  async addArticleToFavoriteList(
    @CurrentUser() user: User,
    @Param('articleId') articleId: number,
  ) {
    return this.articleService.addArticleToFavoriteList(user.id, articleId);
  }

  @ApiOperation({
    summary: 'Delete post favorites',
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Delete('/:articleId/favorite')
  async deleteArticleFavorite(
    @CurrentUser() user: User,
    @Param('articleId') articleId: number,
  ) {
    return this.articleService.deleteArticleFavorite(user.id, articleId);
  }
}
