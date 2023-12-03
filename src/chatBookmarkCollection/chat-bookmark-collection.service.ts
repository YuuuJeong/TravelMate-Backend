import { Injectable } from '@nestjs/common';
import { Bookmark } from '@prisma/client';
import { CreateBookmarkDto } from 'src/bookmark/dtos/req/create-bookmark.dto';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class ChatBookmarkCollectionService {
  constructor(private readonly prisma: PrismaService) {}
  async createChatBookmarkCollection(title: string, roomId: string) {
    return await this.prisma.chatBookmarkCollection.create({
      data: {
        title,
        roomId,
      },
    });
  }

  async createBookmarksInCollection(
    id: number,
    dto: CreateBookmarkDto,
    userId: number,
  ) {
    const bookmarks: Bookmark[] = [];

    for (const location of dto.locationsWithContent) {
      const bookmark = await this.prisma.bookmark.create({
        data: {
          user: {
            connect: {
              id: userId,
            },
          },
          content: location.content,
          location: {
            connectOrCreate: {
              create: {
                latitude: location.latitude,
                longitude: location.longitude,
                ...(location.placeId && {
                  placeId: location.placeId,
                }),
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
        include: {
          location: true,
        },
      });

      bookmarks.push(bookmark);
    }

    await this.prisma.bookmarkChatBookmarkCollectionMap.createMany({
      data: bookmarks.map((bookmark) => ({
        collectionId: id,
        bookmarkId: bookmark.id,
      })),
    });

    return bookmarks;
  }

  async deleteBookmarksInCollection(id: number, bookmarkIds: number[]) {
    const result =
      await this.prisma.bookmarkChatBookmarkCollectionMap.deleteMany({
        where: {
          collectionId: id,
          bookmarkId: {
            in: bookmarkIds,
          },
        },
      });

    return result;
  }

  async fetchChatBookmarkCollection(roomId: string) {
    const chatRoomBookmarkCollection =
      await this.prisma.chatBookmarkCollection.findUniqueOrThrow({
        where: {
          roomId,
        },
      });

    const bookmarkIds = (
      await this.prisma.bookmarkChatBookmarkCollectionMap.findMany({
        where: {
          collectionId: chatRoomBookmarkCollection.id,
        },
      })
    ).map((object) => object.bookmarkId);

    const bookmarks = await this.prisma.bookmark.findMany({
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

    return { bookmarks, collectionId: chatRoomBookmarkCollection.id };
  }
}
