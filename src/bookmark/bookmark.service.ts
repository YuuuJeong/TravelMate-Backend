import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { BookmarkEntity } from './entities/bookmark.entity';
import { BookmarkCollectionService } from 'src/bookmarkCollection/bookmark-collection.service';

@Injectable()
export class BookmarkService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly bookmarkCollection: BookmarkCollectionService,
  ) {}

  /**
   * @desc 북마크 컬렉션 id로 북마크 찾는 메서드
   * @param id
   * @returns Promise<BookmarkEntity>
   * @author 유정호
   */
  async getBookmarksInCollection(id: number): Promise<BookmarkEntity[]> {
    await this.bookmarkCollection.getBookmarkCollectionById(id);

    const bookmarkIds = (
      await this.prisma.bookmarksInCollection.findMany({
        where: {
          collectionId: id,
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
