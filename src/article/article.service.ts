import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreateArticleDto } from './dtos/create-article.dto';
import { Period, Prisma, User } from '@prisma/client';
import { ArticleOrderField, GetArticlesDto } from './dtos/get-articles.dto';

@Injectable()
export class ArticleService {
  constructor(private readonly prisma: PrismaService) {}

  async createArticle(user: User, dto: CreateArticleDto) {
    const article = await this.prisma.article.create({
      data: {
        title: dto.title,
        authorId: user.id,
        location: dto.location,
        thumbnail: dto.thumbnail,
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

  public async getArticles(dto: GetArticlesDto) {
    const { page, limit, period, location, authorId, keyword, order } = dto;

    const whereClause = {
      ...(period === Period.SPRING && {
        springVersionID: {
          not: null,
        },
      }),
      ...(period === Period.SUMMER && {
        summerVersionID: {
          not: null,
        },
      }),
      ...(period === Period.FALL && {
        fallVersionID: {
          not: null,
        },
      }),
      ...(period === Period.WINTER && {
        winterVersionID: {
          not: null,
        },
      }),
      ...(authorId && {
        authorId,
      }),
      ...(location && {
        location,
      }),
      ...(keyword && {
        OR: [
          {
            title: {
              contains: keyword,
            },
          },
          {
            articleTagMap: {
              some: {
                tag: {
                  name: {
                    contains: keyword,
                  },
                },
              },
            },
          },
        ],
      }),
    };

    const orderClause = {
      ...(order === ArticleOrderField.RECENT && {
        createdAt: Prisma.SortOrder.desc,
      }),
      ...(order === ArticleOrderField.TITLE_ASCENDING && {
        title: Prisma.SortOrder.asc,
      }),
      ...(order === ArticleOrderField.TITLE_DESCENDING && {
        title: Prisma.SortOrder.desc,
      }),
      ...(!order && { createdAt: Prisma.SortOrder.desc }),
    };

    const count = await this.prisma.article.count({
      where: {
        ...whereClause,
      },
    });
    const articles = await this.prisma.article.findMany({
      where: {
        ...whereClause,
      },
      orderBy: [orderClause],
      skip: (page - 1) * limit,
      take: limit,
    });

    return {
      count,
      articles,
    };
  }
}
