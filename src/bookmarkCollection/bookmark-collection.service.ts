import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateBookmarkCollectionRequestDTO } from './dtos/req/create-bookmark-collection.dto';
import { BookmarkCollectionDto } from './dtos/bookmark-collection.dto';

@Injectable()
export class BookmarkCollectionService {
  constructor(private readonly prisma: PrismaService) {}

  async createBookmarkCollection(
    dto: CreateBookmarkCollectionRequestDTO,
  ): Promise<BookmarkCollectionDto> {
    const { title, visibility } = dto;
    return await this.prisma.bookmarkCollection.create({
      data: {
        title,
        visibility,
      },
    });
  }

  async removeBookmarkCollection(id: number): Promise<BookmarkCollectionDto> {
    await this.prisma.bookmarksInCollection.deleteMany({
      where: {
        collectionId: id,
      },
    });

    return await this.prisma.bookmarkCollection.delete({
      where: {
        id,
      },
    });
  }
}
