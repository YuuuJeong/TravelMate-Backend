import { Injectable } from '@nestjs/common';
import { BookmarkEntity } from './entities/bookmark.entity';
import { BookmarkCollectionService } from 'src/bookmarkCollection/bookmark-collection.service';
import { PrismaService } from 'src/prisma.service';
import { LocationWithContent } from 'src/bookmarkCollection/dtos/req/update-bookmark-collection.dto';

@Injectable()
export class BookmarkService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly bookmarkCollection: BookmarkCollectionService,
  ) {}

  async createBookmark(userId: number, dto: LocationWithContent) {
    const location = await this.prisma.location.upsert({
      where: {
        latitude: dto.latitude,
        longitude: dto.longitude,
        placeId: dto.placeId,
      },
      create: {
        latitude: dto.latitude,
        longitude: dto.longitude,
        placeId: dto.placeId,
      },
      update: {},
    });

    return this.prisma.bookmark.create({
      data: {
        userId,
        content: dto.content,
        locationId: location.id,
      },
    });
  }

  /**
   * @desc 북마크 컬렉션 id로 북마크 찾는 메서드
   * @param id
   * @returns Promise<BookmarkEntity>
   * @author 유정호
   */
  async getBookmarksInCollection(
    collectionId: number,
  ): Promise<BookmarkEntity[]> {
    await this.bookmarkCollection.getBookmarkCollectionById(collectionId);

    const bookmarkIds = (
      await this.prisma.bookmarkBookmarkCollectionMap.findMany({
        where: {
          collectionId,
        },
      })
    ).map((object) => object.bookmarkId);

    return await this.prisma.bookmark.findMany({
      where: {
        deletedAt: null,
        id: {
          in: bookmarkIds,
        },
      },
      include: {
        location: true,
      },
    });
  }
}
