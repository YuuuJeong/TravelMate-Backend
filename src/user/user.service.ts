import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  findUserById(userId: number) {
    return this.prisma.user.findUnique({
      where: {
        id: userId,
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
