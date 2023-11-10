import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateBookmarkCollectionRequestDTO } from './dtos/req/create-bookmark-collection.dto';
import { UpdateBookmarkCollectionRequestDTO } from './dtos/req/update-bookmark-collection.dto';
import { BookmarkCollectionEntity } from './entities/bookmark-collection.entity';
import { PrismaService } from 'src/prisma.service';
import { FetchMyBookmarkCollectionDto } from './dtos/req/fetch-my-bookmark-collections.dto';
import { Prisma, Visibility } from '@prisma/client';
import { OffsetPaginationDto } from 'src/common/dtos/offset-pagination.dto';

@Injectable()
export class BookmarkCollectionService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * @desc 북마크 컬렉션에 들어있는 북마크
   * @param collectionId
   * @returns number[]
   * @author 유정호
   */
  private async getBookmarkIdsInCollection(
    collectionId: number,
  ): Promise<number[]> {
    const bookmarksInCollections =
      await this.prisma.bookmarkBookmarkCollectionMap.findMany({
        where: {
          collectionId,
        },
      });

    return bookmarksInCollections.map((obj) => obj.bookmarkId);
  }

  /**
   * @desc 북마크 컬렉션 id로 북마크 찾는 메서드
   * @param id
   * @returns Promise<BookmarkCollectionEntity>
   * @author 유정호
   */
  public async getBookmarkCollectionById(
    id: number,
  ): Promise<BookmarkCollectionEntity> {
    const bookmarkCollection: BookmarkCollectionEntity | null =
      await this.prisma.bookmarkCollection.findUnique({
        where: {
          id,
        },
      });

    if (!bookmarkCollection) {
      throw new BadRequestException('존재하지 않는 북마크 컬렉션입니다.');
    }

    return bookmarkCollection;
  }

  /**
   * @desc 북마크 컬렉션 생성
   * @param dto
   * @returns Promise<BookmarkCollectionEntity>
   * @author 유정호
   */
  async createBookmarkCollection(
    userId: number,
    dto: CreateBookmarkCollectionRequestDTO,
  ): Promise<BookmarkCollectionEntity> {
    const { title, visibility } = dto;

    return await this.prisma.bookmarkCollection.create({
      data: {
        title,
        visibility,
        userId,
      },
    });
  }

  /**
   * @desc 북마크 컬렉션 삭제
   * @param id
   * @returns Promise<BookmarkCollectionEntity>
   * @author 유정호
   */
  async removeBookmarkCollection(
    id: number,
  ): Promise<BookmarkCollectionEntity> {
    await this.getBookmarkCollectionById(id);

    await this.prisma.bookmarkBookmarkCollectionMap.deleteMany({
      where: {
        collectionId: id,
      },
    });

    const bookmarkIdsIncollection: number[] =
      await this.getBookmarkIdsInCollection(id);

    await this.prisma.bookmark.deleteMany({
      where: {
        id: {
          in: bookmarkIdsIncollection,
        },
      },
    });

    return await this.prisma.bookmarkCollection.delete({
      where: {
        id,
      },
    });
  }

  async fetchMyBookmarkCollections(
    userId: number,
    dto: FetchMyBookmarkCollectionDto,
  ) {
    const { limit, page, visibility } = dto;

    const count = await this.prisma.bookmarkCollection.count({
      where: {
        userId,
        ...(visibility && {
          visibility,
        }),
      },
    });

    const bookmarkCollections = await this.prisma.bookmarkCollection.findMany({
      where: {
        userId,
        visibility,
      },
      skip: (page - 1) * limit,
      take: limit,
      orderBy: {
        createdAt: Prisma.SortOrder.desc,
      },
    });

    return { bookmarkCollections, count };
  }

  /**
   * @desc 북마크 컬렉션 수정
   * @param id
   * @param dto
   * @returns Promise<BookmarkCollectionEntity>
   * @author 유정호
   */
  async updateBookmarkCollection(
    userId: number,
    collectionId: number,
    dto: UpdateBookmarkCollectionRequestDTO,
  ): Promise<BookmarkCollectionEntity> {
    const { title, visibility, locationsWithContent, bookmarkIdsToDelete } =
      dto;
    await this.getBookmarkCollectionById(collectionId);

    //북마크 soft delete
    await Promise.all(
      bookmarkIdsToDelete.map(async (bookmarkId) => {
        await this.prisma.bookmark.update({
          where: {
            id: bookmarkId,
          },
          data: {
            deletedAt: new Date(),
            BookmarkBookmarkCollectionMap: {
              deleteMany: {
                collectionId,
                bookmarkId: bookmarkId,
              },
            },
          },
        });
      }),
    );

    //북마크 생성하면서 위치가 없다면 위치도 생성, 있으면 연결
    const bookmarkIds: number[] = [];
    for (const location of locationsWithContent) {
      const bookmark = await this.prisma.bookmark.create({
        data: {
          user: {
            connect: {
              id: userId,
            },
          },
          ...(location.content && {
            content: location.content,
          }),
          location: {
            connectOrCreate: {
              create: {
                latitude: location.latitude,
                longitude: location.longitude,
              },
              where: {
                latitude_longitude: {
                  latitude: location.latitude,
                  longitude: location.longitude,
                },
              },
            },
          },
        },
      });

      bookmarkIds.push(bookmark.id);
    }

    //북마크 컬렉션과 매핑
    await this.prisma.bookmarkBookmarkCollectionMap.createMany({
      data: bookmarkIds.map((bookmarkId) => ({
        collectionId,
        bookmarkId: bookmarkId,
      })),
    });

    //북마크 컬렉션 정보 수정
    return await this.prisma.bookmarkCollection.update({
      where: {
        id: collectionId,
      },
      data: {
        title,
        visibility,
      },
    });
  }

  async getBookmarkCollections(
    id: number,
    userId: number,
    dto: OffsetPaginationDto,
  ) {
    const { limit, page } = dto;
    const visibilities: Visibility[] = [Visibility.PUBLIC];
    //TODO: 친구추가 기능이후 id 유저와 userId 유저가 서로 친구인지 확인후 친구라면 visibilites 배열에 FRIENDS_ONLY추가
    const count = await this.prisma.bookmarkCollection.count({
      where: {
        userId,
        visibility: {
          in: visibilities,
        },
      },
    });

    const bookmarkCollections = await this.prisma.bookmarkCollection.findMany({
      where: {
        userId,
        visibility: {
          in: visibilities,
        },
      },
      skip: (page - 1) * limit,
      take: limit,
      orderBy: {
        createdAt: Prisma.SortOrder.desc,
      },
    });

    return { bookmarkCollections, count };
  }
}
