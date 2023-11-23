import { BadRequestException, Injectable } from '@nestjs/common';
import { FriendInviteStatus, Prisma } from '@prisma/client';
import { OffsetPaginationDto } from 'src/common/dtos/offset-pagination.dto';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class FriendService {
  constructor(private readonly prisma: PrismaService) {}
  async removeFriend(invitationId: number) {
    const friendInvite = await this.prisma.friendInvite.findUniqueOrThrow({
      where: {
        id: invitationId,
      },
    });

    await Promise.all([
      this.prisma.friendInvite.deleteMany({
        where: {
          OR: [
            { id: invitationId },
            { friendId: friendInvite.userId, userId: friendInvite.friendId },
          ],
        },
      }),
    ]);

    return '친구가 삭제되었습니다.';
  }

  async acceptFriendInvitation(invitationId: number) {
    const friendInvite = await this.prisma.friendInvite.update({
      where: {
        id: invitationId,
      },
      data: {
        status: FriendInviteStatus.ACCEPTED,
        acceptedAt: new Date(),
      },
    });

    await this.prisma.friendInvite.create({
      data: {
        status: FriendInviteStatus.ACCEPTED,
        acceptedAt: new Date(),
        userId: friendInvite.friendId,
        friendId: friendInvite.userId,
      },
    });

    return '친구가 추가되었습니다.';
  }

  async fetchMyFriends(userId: number, dto: OffsetPaginationDto) {
    const { limit, page } = dto;

    const count = await this.prisma.friendInvite.count({
      where: {
        status: FriendInviteStatus.ACCEPTED,
        userId,
      },
    });

    const friends = await this.prisma.friendInvite.findMany({
      where: {
        status: FriendInviteStatus.ACCEPTED,
        userId,
      },
      include: {
        friend: true,
      },
      skip: (page - 1) * limit,
      take: limit,
      orderBy: {
        acceptedAt: Prisma.SortOrder.desc,
      },
    });

    return { friends, count };
  }

  async sendFriendInviteRequest(id: number, friendId: number) {
    if (id === friendId) {
      throw new BadRequestException('본인에게 친구요청을 할 수 없습니다.');
    }

    const acceptedFriendRequest = await this.prisma.friendInvite.findFirst({
      where: {
        OR: [
          { userId: id, friendId, status: FriendInviteStatus.ACCEPTED },
          {
            userId: friendId,
            friendId: id,
            status: FriendInviteStatus.ACCEPTED,
          },
        ],
      },
    });

    if (acceptedFriendRequest) {
      throw new BadRequestException('이미 친구관계인 유저입니다.');
    }

    const friendRequest = await this.prisma.friendInvite.findUnique({
      where: {
        userId_friendId_status: {
          friendId,
          userId: id,
          status: FriendInviteStatus.PENDING,
        },
      },
    });

    if (friendRequest) {
      throw new BadRequestException(
        '해당 유저에게 이미 친구요청을 보냈습니다.',
      );
    }

    const receivedFriendRequest = await this.prisma.friendInvite.findUnique({
      where: {
        userId_friendId_status: {
          friendId: id,
          userId: friendId,
          status: FriendInviteStatus.PENDING,
        },
      },
    });

    if (receivedFriendRequest) {
      await this.prisma.friendInvite.update({
        where: {
          userId_friendId_status: {
            friendId: id,
            userId: friendId,
            status: FriendInviteStatus.PENDING,
          },
        },
        data: {
          status: FriendInviteStatus.ACCEPTED,
          acceptedAt: new Date(),
        },
      });

      return '친구가 추가되었습니다.';
    }

    return await this.prisma.friendInvite.create({
      data: {
        userId: id,
        friendId,
      },
    });
  }

  async fetchReceivedFriendInvitation(
    userId: number,
    dto: OffsetPaginationDto,
  ) {
    const { limit, page } = dto;

    const count = await this.prisma.friendInvite.count({
      where: {
        status: FriendInviteStatus.PENDING,
        friendId: userId,
      },
    });

    const friends = await this.prisma.friendInvite.findMany({
      where: {
        status: FriendInviteStatus.PENDING,
        friendId: userId,
      },
      include: {
        user: true,
      },
      skip: (page - 1) * limit,
      take: limit,
      orderBy: {
        acceptedAt: Prisma.SortOrder.desc,
      },
    });

    return { friends, count };
  }

  async fetchSentFriendInvitation(userId: number, dto: OffsetPaginationDto) {
    const { limit, page } = dto;

    const count = await this.prisma.friendInvite.count({
      where: {
        status: FriendInviteStatus.PENDING,
        userId,
      },
    });

    const friends = await this.prisma.friendInvite.findMany({
      where: {
        status: FriendInviteStatus.PENDING,
        userId,
      },
      include: {
        friend: true,
      },
      skip: (page - 1) * limit,
      take: limit,
      orderBy: {
        acceptedAt: Prisma.SortOrder.desc,
      },
    });

    return { friends, count };
  }

  async fetchMyFavoriteArticles(userId: number, dto: OffsetPaginationDto) {
    const { page, limit } = dto;

    const articleIds: number[] = (
      await this.prisma.userFavoriteArticleMap.findMany({
        where: {
          userId,
        },
      })
    ).map((userFavoriteArticle) => userFavoriteArticle.articleId);

    const count = await this.prisma.article.count({
      where: {
        deletedAt: null,
        id: {
          in: articleIds,
        },
      },
    });

    const articles = await this.prisma.article.findMany({
      where: {
        deletedAt: null,
        id: {
          in: articleIds,
        },
      },
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
}
