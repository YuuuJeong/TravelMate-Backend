import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class FriendService {
  constructor(private readonly prisma: PrismaService) {}
  async sendFriendInviteRequest(id: number, friendId: number): Promise<any> {
    const friendRequest = await this.prisma.friendInvite.findUnique({
      where: {
        userId_friendId: {
          userId: id,
          friendId,
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
        userId_friendId: {
          friendId: id,
          userId: friendId,
        },
      },
    });

    if (receivedFriendRequest) {
      await this.prisma.friendInvite.update({
        where: {
          userId_friendId: {
            friendId: id,
            userId: friendId,
          },
        },
        data: {
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
}
