import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateBookmarkCollectionRequestDTO } from './dtos/req/create-bookmark-collection.dto';
import { UpdateBookmarkCollectionRequestDTO } from './dtos/req/update-bookmark-collection.dto';
import { BookmarkCollectionEntity } from './entities/bookmark-collection.entity';
import { PrismaService } from 'src/prisma.service';

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
      await this.prisma.bookmarksInCollection.findMany({
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
  private async getBookmarkCollectionById(
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
    dto: CreateBookmarkCollectionRequestDTO,
  ): Promise<BookmarkCollectionEntity> {
    const { title, visibility } = dto;
    const userId = 1; //TODO: JWT payload userId로 추후에 대체

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

    await this.prisma.bookmarksInCollection.deleteMany({
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

  async fetchBookmarkCollections(): Promise<BookmarkCollectionEntity[]> {
    //TODO: JWT payload userId로 추후에 대체
    return await this.prisma.bookmarkCollection.findMany({
      where: {
        userId: 1,
      },
    });
  }

  /**
   * @desc 북마크 컬렉션 수정
   * @param id
   * @param dto
   * @returns Promise<BookmarkCollectionEntity>
   * @author 유정호
   */
  async updateBookmarkCollection(
    id: number,
    dto: UpdateBookmarkCollectionRequestDTO,
  ): Promise<BookmarkCollectionEntity> {
    const { title, visibility, locationsWithContent, bookmarkIdsToDelete } =
      dto;

    await this.getBookmarkCollectionById(id);

    //북마크 soft delete
    await Promise.all(
      bookmarkIdsToDelete.map(async (bookmarkId) => {
        await this.prisma.bookmark.update({
          where: {
            id: bookmarkId,
          },
          data: {
            deletedAt: new Date(),
            bookmarksInCollection: {
              deleteMany: {
                collectionId: id,
                bookmarkId: bookmarkId,
              },
            },
          },
        });
      }),
    );

    //북마크 생성하면서 위치가 없다면 위치도 생성, 있으면 연결
    const bookmarkIds: number[] = [];
    for (const data of locationsWithContent) {
      const bookmark = await this.prisma.bookmark.create({
        data: {
          content: data.content,
          location: {
            connectOrCreate: {
              create: {
                latitude: data.latitude,
                longitude: data.longitude,
              },
              where: {
                latitude_longitude: {
                  latitude: data.latitude,
                  longitude: data.longitude,
                },
              },
            },
          },
        },
      });

      bookmarkIds.push(bookmark.id);
    }

    //북마크 컬렉션과 매핑
    await this.prisma.bookmarksInCollection.createMany({
      data: bookmarkIds.map((bookmarkId) => ({
        collectionId: id,
        bookmarkId: bookmarkId,
      })),
    });

    //북마크 컬렉션 정보 수정
    return await this.prisma.bookmarkCollection.update({
      where: {
        id,
      },
      data: {
        title,
        visibility,
      },
    });
  }
}
