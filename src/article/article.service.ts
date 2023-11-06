import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreateArticleDto } from './dtos/create-article.dto';
import { Period, User } from '@prisma/client';

@Injectable()
export class ArticleService {
  constructor(private readonly prisma: PrismaService) {}

  async createArticle(user: User, dto: CreateArticleDto) {
    const article = await this.prisma.article.create({
      data: {
        title: dto.title,
        userId: user.id,
        articleTagMap: {
          create: dto.tagIds.map((tagId) => ({
            tagId,
          })),
        },
      },
    });

    const versionHistory = await this.createArticleVerionHistory(
      user,
      article.id,
      dto,
    );

    const articleUpdateInput = {
      ...(dto.period === Period.SPRING && {
        springVersionID: versionHistory.id,
      }),
      ...(dto.period === Period.SUMMER && {
        summerVersionID: versionHistory.id,
      }),
      ...(dto.period === Period.FALL && {
        fallVersionID: versionHistory.id,
      }),
      ...(dto.period === Period.WINTER && {
        winterVersionID: versionHistory.id,
      }),
    };

    return await this.prisma.article.update({
      where: {
        id: article.id,
      },
      data: {
        ...articleUpdateInput,
      },
      include: {
        articleTagMap: {
          include: {
            tag: true,
          },
        },
      },
    });
  }

  public createArticleVerionHistory(
    user: User,
    articleId: number,
    dto: CreateArticleDto,
  ) {
    return this.prisma.articleVersionHistory.create({
      data: {
        articleId,
        content: dto.content,
        period: dto.period,
        userId: user.id,
      },
    });
  }
}
