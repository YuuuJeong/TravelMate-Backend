import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreateArticleDto } from './dtos/create-article.dto';
import { Period, Prisma, User } from '@prisma/client';
import { ArticleOrderField, GetArticlesDto } from './dtos/get-articles.dto';
import { UpdateArticleDto } from './dtos/update-article.dto';
import { RequestArticleDto } from './dtos/request-article.dto';

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
      user.id,
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
    userId: number,
    articleId: number,
    dto: CreateArticleDto,
  ) {
    return this.prisma.articleVersionHistory.create({
      data: {
        articleId,
        content: dto.content,
        period: dto.period,
        userId,
      },
    });
  }

  private buildGetArticlesWhereInput(dto: GetArticlesDto) {
    const { period, location, authorId, keyword, order } = dto;
    const orInput = [
      {
        ...(period?.includes(Period.SPRING) && {
          springVersionID: {
            not: null,
          },
        }),
      },
      {
        ...(period?.includes(Period.WINTER) && {
          winterVersionID: {
            not: null,
          },
        }),
      },
      {
        ...(period?.includes(Period.FALL) && {
          fallVersionID: {
            not: null,
          },
        }),
      },
      {
        ...(period?.includes(Period.SUMMER) && {
          summerVersionID: {
            not: null,
          },
        }),
      },
    ];

    const andInput = [
      {
        OR: [
          {
            ...(keyword && {
              title: {
                contains: keyword,
              },
            }),
          },
          {
            ...(keyword && {
              articleTagMap: {
                some: {
                  tag: {
                    name: {
                      contains: keyword,
                    },
                  },
                },
              },
            }),
          },
        ],
      },
    ];

    return {
      deletedAt: null,
      ...(authorId && {
        authorId,
      }),
      ...(location && {
        location,
      }),
      OR: orInput,
      AND: andInput,
    };
  }

  public async getArticles(dto: GetArticlesDto) {
    const { page, limit, period, location, authorId, keyword, order } = dto;

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

    const whereClause = this.buildGetArticlesWhereInput(dto);

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
      include: {
        articleTagMap: {
          include: {
            tag: true,
          },
        },
      },
    });

    return {
      count,
      articles,
    };
  }

  async getArticle(articleId: number) {
    const article = await this.prisma.article.findUniqueOrThrow({
      where: {
        id: articleId,
      },
      include: {
        articleTagMap: {
          include: {
            tag: true,
          },
        },
      },
    });

    const spring = article.springVersionID
      ? await this.prisma.articleVersionHistory.findUnique({
          where: {
            id: article.springVersionID,
          },
        })
      : null;

    const summer = article.summerVersionID
      ? await this.prisma.articleVersionHistory.findUnique({
          where: {
            id: article.summerVersionID,
          },
        })
      : null;

    const fall = article.fallVersionID
      ? await this.prisma.articleVersionHistory.findUnique({
          where: {
            id: article.fallVersionID,
          },
        })
      : null;

    const winter = article.winterVersionID
      ? await this.prisma.articleVersionHistory.findUnique({
          where: {
            id: article.winterVersionID,
          },
        })
      : null;

    return {
      ...article,
      spring,
      summer,
      fall,
      winter,
    };
  }

  async updateArticle(
    userId: number,
    articleId: number,
    dto: UpdateArticleDto,
  ) {
    const { title, period, tagIds, location, thumbnail } = dto;

    const article = await this.prisma.article.findUniqueOrThrow({
      where: {
        id: articleId,
      },
    });

    if (article.authorId !== userId) {
      throw new BadRequestException('권한이 없습니다.');
    }

    let historyUpdateInput;

    if (period) {
      const newVersionHistory = await this.createArticleVerionHistory(
        userId,
        article.id,
        dto as CreateArticleDto,
      );

      historyUpdateInput = {
        ...(period === Period.SPRING && {
          springVersionID: newVersionHistory.id,
        }),
        ...(period === Period.SUMMER && {
          summerVersionID: newVersionHistory.id,
        }),
        ...(period === Period.FALL && {
          fallVersionID: newVersionHistory.id,
        }),
        ...(period === Period.WINTER && {
          winterVersionID: newVersionHistory.id,
        }),
      };
    }

    const tagUpdateInput = {
      ...(tagIds && {
        articleTagMap: {
          deleteMany: {
            tagId: {
              notIn: tagIds,
            },
          },
          createMany: {
            data: tagIds.map((tagId) => ({
              tagId,
            })),
          },
        },
      }),
    };

    return await this.prisma.article.update({
      where: {
        id: articleId,
      },
      data: {
        title,
        location,
        thumbnail,
        ...historyUpdateInput,
        ...tagUpdateInput,
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

  deleteArticle(userId: number, articleId: number) {
    return this.prisma.article.update({
      where: {
        id: articleId,
      },
      data: {
        deletedAt: new Date(),
      },
    });
  }

  public async requestArticle(
    userId: number,
    articleId: number,
    dto: RequestArticleDto,
  ) {
    const { period, content } = dto;

    await this.prisma.article.findUniqueOrThrow({
      where: {
        id: articleId,
      },
    });

    return this.prisma.pendingArticleRequest.create({
      data: {
        articleId,
        content,
        period,
        userId,
      },
    });
  }

  public async showRequests(userId: number, articleId: number, period: Period) {
    const article = await this.prisma.article.findUniqueOrThrow({
      where: {
        id: articleId,
      },
    });

    if (article.authorId !== userId) {
      throw new BadRequestException('권한이 없습니다.');
    }

    return this.prisma.pendingArticleRequest.findMany({
      where: {
        articleId,
        period,
      },
    });
  }

  async addArticleToFavoriteList(userId: number, articleId: number) {
    return await this.prisma.userFavoriteArticleMap.upsert({
      where: {
        userId_articleId: {
          userId,
          articleId,
        },
      },
      create: {
        userId,
        articleId,
      },
      update: {},
    });
  }

  async deleteArticleFavorite(userId: number, articleId: number) {
    return await this.prisma.userFavoriteArticleMap.delete({
      where: {
        userId_articleId: {
          userId,
          articleId,
        },
      },
    });
  }
}
