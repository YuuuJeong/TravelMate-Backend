import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreateArticleDto, ELocation } from './dtos/create-article.dto';
import {
  Period,
  Prisma,
  RequestBookmarkType,
  User,
  UserLevel,
} from '@prisma/client';
import { ArticleOrderField, GetArticlesDto } from './dtos/get-articles.dto';
import { UpdateArticleDto } from './dtos/update-article.dto';
import { RequestArticleDto } from './dtos/request-article.dto';
import { OffsetPaginationDto } from 'src/common/dtos/offset-pagination.dto';
import { GetMyRequestsDto } from 'src/user/dtos/req/get-my-requests.dto';
import { bookmark } from '../bookmarkCollection/data/bookmark-collection.data';

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
        ...(dto.bookmarkIds && {
          articleBookmarkMap: {
            create: dto.bookmarkIds.map((bookmarkId) => ({
              bookmarkId,
              period: dto.period,
            })),
          },
        }),
        ...(dto.tagIds && {
          articleTagMap: {
            create: dto.tagIds.map((tagId) => ({
              tagId,
            })),
          },
        }),
      },
    });

    const versionHistory = await this.createArticleVerionHistory(
      user.id,
      article.id,
      dto.content,
      dto.period,
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
        articleBookmarkMap: {
          include: {
            bookmark: {
              include: {
                location: true,
              },
            },
          },
        },
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
    content: string,
    period: Period,
  ) {
    return this.prisma.articleVersionHistory.create({
      data: {
        articleId,
        content,
        period,
        userId,
      },
    });
  }

  private buildGetArticlesWhereInput(dto: GetArticlesDto) {
    const { period, location, authorId, keyword } = dto;

    const orInput = period
      ? [
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
        ]
      : [];

    const andInput = keyword
      ? [
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
        ]
      : [];

    return {
      deletedAt: null,
      ...(authorId && {
        authorId,
      }),
      ...(location && {
        location,
      }),
      ...(orInput.length > 0 && {
        OR: orInput,
      }),
      ...(andInput.length > 0 && {
        AND: andInput,
      }),
    };
  }

  public async getArticles(dto: GetArticlesDto) {
    const { page, limit, order } = dto;

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

  getArticlesCount(period: Period) {
    return Promise.all(
      Object.values(ELocation).map(async (value) => {
        const count = await this.prisma.article.count({
          where: {
            deletedAt: null,
            location: value,
            ...(period && {
              OR: [
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
              ],
            }),
          },
        });

        return {
          location: value,
          count,
        };
      }),
    );
  }

  async getArticle(articleId: number, userId: number) {
    const article = await this.prisma.article.findUniqueOrThrow({
      where: {
        id: articleId,
      },
      include: {
        articleBookmarkMap: {
          include: {
            bookmark: {
              include: {
                location: true,
              },
            },
          },
        },
        articleTagMap: {
          include: {
            tag: true,
          },
        },
        userFavoriteArticleMap: {
          where: {
            userId,
            articleId,
          },
        },
      },
    });

    const isFavorite = article.userFavoriteArticleMap.length > 0 ? true : false;

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
      isFavorite,
    };
  }

  getMyArticleRequests(userId: number, dto: GetMyRequestsDto) {
    return this.prisma.pendingArticleRequest.findMany({
      where: {
        userId,
        ...(dto.type === 'accepted' && {
          acceptedAt: {
            not: null,
          },
        }),
        ...(dto.type === 'declined' && {
          declinedAt: {
            not: null,
          },
        }),
        ...(dto.type === 'pending' && {
          acceptedAt: null,
          declinedAt: null,
        }),
        article: {
          deletedAt: null,
        },
      },
      include: {
        article: true,
      },
      orderBy: {
        createdAt: Prisma.SortOrder.desc,
      },
    });
  }

  async getMyArticles(userId: number, dto: OffsetPaginationDto) {
    const { page, limit } = dto;
    const count = await this.prisma.article.count({
      where: {
        authorId: userId,
        deletedAt: null,
      },
    });

    const articles = await this.prisma.article.findMany({
      where: {
        authorId: userId,
        deletedAt: null,
      },
      skip: (page - 1) * limit,
      take: limit,
      include: {
        articleTagMap: {
          include: {
            tag: true,
          },
        },
        pendingArticleRequests: {
          where: {
            acceptedAt: null,
            declinedAt: null,
          },
          select: {
            id: true,
            period: true,
          },
        },
      },
    });

    return {
      count,
      articles,
    };
  }

  async updateArticle(
    userId: number,
    articleId: number,
    dto: UpdateArticleDto,
  ) {
    const { title, period, tagIds, location, thumbnail, bookmarkIds } = dto;

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
        dto.content,
        dto.period,
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

    const bookmarkUpdateInput = {
      ...(bookmarkIds && {
        articleBookmarkMap: {
          deleteMany: {
            period,
          },
          createMany: {
            data: bookmarkIds.map((bookmarkId) => ({
              bookmarkId,
              period,
            })),
          },
        },
      }),
    };

    const tagUpdateInput = {
      ...(tagIds && {
        articleTagMap: {
          deleteMany: {},
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
        ...bookmarkUpdateInput,
        ...historyUpdateInput,
        ...tagUpdateInput,
      },
      include: {
        articleBookmarkMap: {
          include: {
            bookmark: {
              include: {
                location: true,
              },
            },
          },
        },
        articleTagMap: {
          include: {
            tag: true,
          },
        },
      },
    });
  }

  async deleteArticle(user: User, articleId: number) {
    const { id, level } = user;

    const article = await this.prisma.article.findUniqueOrThrow({
      where: {
        id: articleId,
      },
    });

    if (article.authorId !== id && level !== UserLevel.ADMIN) {
      throw new BadRequestException('글을 삭제할 권한이 없습니다.');
    }

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
    const { period, content, comment, bookmarksToAdd, bookmarksToRemove } = dto;

    await this.prisma.article.findUniqueOrThrow({
      where: {
        id: articleId,
      },
    });

    const request = await this.prisma.pendingArticleRequest.create({
      data: {
        articleId,
        content,
        comment,
        period,
        userId,
      },
    });

    const bookmarks: Prisma.PendingArticleRequestBookmarkMapCreateManyInput[] =
      [];

    bookmarksToAdd?.forEach((bookmarkId) => {
      bookmarks.push({
        bookmarkId,
        pendingArticleRequestId: request.id,
        type: RequestBookmarkType.ADD,
      });
    });

    bookmarksToRemove?.forEach((bookmarkId) => {
      bookmarks.push({
        bookmarkId,
        pendingArticleRequestId: request.id,
        type: RequestBookmarkType.REMOVE,
      });
    });

    if (bookmarks.length > 0)
      await this.prisma.pendingArticleRequestBookmarkMap.createMany({
        data: bookmarks,
      });

    return request;
  }

  public async getRequest(
    userId: number,
    articleId: number,
    requestId: number,
  ) {
    const article = await this.prisma.article.findUniqueOrThrow({
      where: {
        id: articleId,
      },
    });

    if (article.authorId !== userId) {
      throw new BadRequestException('권한이 없습니다.');
    }

    return this.prisma.pendingArticleRequest.findUniqueOrThrow({
      where: {
        id: requestId,
      },
      include: {
        PendingArticleRequestBookmarkMap: {
          include: {
            bookmark: {
              include: {
                location: true,
              },
            },
          },
        },
      },
    });
  }

  public async showRequests(
    userId: number,
    articleId: number,
    period: Period | string,
  ) {
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
        ...(period !== 'ALL' && {
          period: period as Period,
        }),
        acceptedAt: null,
        declinedAt: null,
      },
    });
  }

  public async acceptRequest(
    userId: number,
    articleId: number,
    requestId: number,
  ) {
    const article = await this.prisma.article.findUniqueOrThrow({
      where: {
        id: articleId,
      },
    });

    if (article.authorId !== userId) {
      throw new BadRequestException('권한이 없습니다.');
    }

    const request = await this.prisma.pendingArticleRequest.findUniqueOrThrow({
      where: {
        id: requestId,
      },
      include: {
        PendingArticleRequestBookmarkMap: true,
      },
    });

    const bookmarksToAdd = request.PendingArticleRequestBookmarkMap.filter(
      (bookmark) => bookmark.type === RequestBookmarkType.ADD,
    );

    const bookmarksToRemove = request.PendingArticleRequestBookmarkMap.filter(
      (bookmark) => bookmark.type === RequestBookmarkType.REMOVE,
    );

    await this.prisma.pendingArticleRequest.update({
      where: {
        id: requestId,
      },
      data: {
        acceptedAt: new Date(),
      },
    });

    const versionHistory = await this.createArticleVerionHistory(
      request.userId,
      article.id,
      request.content,
      request.period,
    );

    await this.prisma.article.update({
      where: {
        id: articleId,
      },
      data: {
        ...(request.period === Period.SPRING && {
          springVersionID: versionHistory.id,
        }),
        ...(request.period === Period.SUMMER && {
          summerVersionID: versionHistory.id,
        }),
        ...(request.period === Period.FALL && {
          fallVersionID: versionHistory.id,
        }),
        ...(request.period === Period.WINTER && {
          winterVersionID: versionHistory.id,
        }),
        articleBookmarkMap: {
          createMany: {
            data: bookmarksToAdd.map((bookmark) => ({
              bookmarkId: bookmark.bookmarkId,
              period: request.period,
            })),
          },
          deleteMany: {
            bookmarkId: {
              in: bookmarksToRemove.map((bookmark) => bookmark.bookmarkId),
            },
            period: request.period,
          },
        },
      },
    });

    return this.prisma.pendingArticleRequest.findUnique({
      where: {
        id: requestId,
      },
    });
  }

  public async declineRequest(
    userId: number,
    articleId: number,
    requestId: number,
  ) {
    const article = await this.prisma.article.findUniqueOrThrow({
      where: {
        id: articleId,
      },
    });

    if (article.authorId !== userId) {
      throw new BadRequestException('권한이 없습니다.');
    }

    return this.prisma.pendingArticleRequest.update({
      where: {
        id: requestId,
      },
      data: {
        declinedAt: new Date(),
      },
    });
  }

  public async showAcceptedRequests(
    userId: number,
    articleId: number,
    period: Period | string,
  ) {
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
        ...(period !== 'ALL' && {
          period: period as Period,
        }),
        acceptedAt: {
          not: null,
        },
      },
      include: {
        PendingArticleRequestBookmarkMap: {
          include: {
            bookmark: {
              include: {
                location: true,
              },
            },
          },
        },
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
