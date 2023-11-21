import { Injectable, BadRequestException } from '@nestjs/common';
import { FriendInviteStatus } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async fetchUsersByNickname(nickname: string, userId: number) {
    const friendInvites = await this.prisma.friendInvite.findMany({
      where: {
        userId,
        status: FriendInviteStatus.ACCEPTED,
      },
    });

    const friendIds: number[] = friendInvites.map((friendInvite) => {
      return friendInvite.friendId;
    });

    return await this.prisma.user.findMany({
      where: {
        nickname: {
          contains: nickname,
        },
        id: {
          not: {
            in: [...friendIds, userId],
          },
        },
      },
    });
  }

  findUsersByIds(userIds: number[]) {
    return this.prisma.user.findMany({
      where: {
        id: {
          in: userIds,
        },
      },
      select: {
        id: true,
        nickname: true,
        profileImageId: true,
      },
    });
  }

  findUserById(userId: number) {
    return this.prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        id: true,
        nickname: true,
        profileImageId: true,
      },
    });
  }

  async verifyIsValidNickname(nickname: string): Promise<string> {
    const user = await this.prisma.user.findFirst({
      where: {
        nickname,
      },
    });

    if (user) {
      throw new BadRequestException('이미 존재하는 닉네임입니다.');
    }

    return nickname;
  }

  async changeUserNickname(userId: number, nickname: string): Promise<string> {
    await this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        nickname,
      },
    });

    return '닉네임 변경 완료';
  }
}
