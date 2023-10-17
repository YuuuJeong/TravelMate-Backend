import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateBookmarkCollectionRequestDTO } from './dtos/req/create-bookmark-collection.dto';

@Injectable()
export class BookmarkCollectionService {
  constructor(private readonly prisma: PrismaService) {}

  async createBookmarkCollection(dto: CreateBookmarkCollectionRequestDTO) {
    const { title, visibility } = dto;
    return await this.prisma.bookmarkCollection.create({
      data: {
        title,
        visibility,
      },
    });
  }
}
