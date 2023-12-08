import { BadRequestException, Injectable } from '@nestjs/common';
import { OffsetPaginationDto } from 'src/common/dtos/offset-pagination.dto';
import { PrismaService } from 'src/prisma.service';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AdminService {
  constructor(
    private prisma: PrismaService,
    private userService: UserService,
  ) {}

  async banUser(userId: number, reason: string) {
    const [user, userBanLog] = await Promise.all([
      this.prisma.user.update({
        where: {
          id: userId,
        },
        data: {
          bannedAt: new Date(),
        },
      }),
      this.prisma.userBanLog.create({
        data: {
          userId,
          reason,
        },
      }),
      this.prisma.userReportLog.deleteMany({
        where: {
          reportedUserId: userId,
        },
      }),
    ]);

    return `${user.nickname}님을 ${userBanLog.reason}과 같은 사유로 정지시켰습니다.`;
  }

  async getAllUsers(dto: OffsetPaginationDto) {
    const count = await this.prisma.user.count({});
    const nodes = await this.prisma.user.findMany({
      take: dto.limit,
      skip: (dto.page - 1) * dto.limit,
    });

    return { nodes, count };
  }

  async unblockUser(userId: number) {
    const user = await this.userService.findUserById(userId);
    if (!user) {
      throw new BadRequestException('유저를 찾을 수 없습니다.');
    }

    await Promise.all([
      this.prisma.userBanLog.delete({
        where: {
          userId,
        },
      }),
      this.prisma.user.update({
        where: {
          id: userId,
        },
        data: {
          bannedAt: null,
        },
      }),
    ]);

    return '유저의 정지가 해제되었습니다.';
  }
}
