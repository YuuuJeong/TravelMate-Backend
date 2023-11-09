import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ArticleService } from './article.service';
import { JwtAuthGuard } from 'src/auth/strategies/jwt.strategy';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { User } from '@prisma/client';
import { CreateArticleDto } from './dtos/create-article.dto';
import { GetArticlesDto } from './dtos/get-articles.dto';
import { UpdateArticleDto } from './dtos/update-article.dto';

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
}
