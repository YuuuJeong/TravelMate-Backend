import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreateUserReportLogDto } from './dtos/create-user-report-log.dto';
import { UserService } from 'src/user/user.service';
import { OffsetPaginationDto } from 'src/common/dtos/offset-pagination.dto';
import { FetchUserReportLogsDto } from 'src/admin/dtos/fetch-user-report-logs.dto';

@Injectable()
export class UserReportLogService {
  constructor(
    private prisma: PrismaService,
    private userService: UserService,
  ) {}

  async reportUser(reporterUserId: number, dto: CreateUserReportLogDto) {
    const { reportedUserId, reason } = dto;

    const reportedUser = await this.userService.findUserById(reportedUserId);
    if (!reportedUser) {
      throw new BadRequestException(
        '신고하려고 하는 유저는 서비스에 존재하지 않는 유저입니다.',
      );
    }

    return await this.prisma.userReportLog.create({
      data: {
        reportedUserId,
        reporterUserId,
        reason,
      },
    });
  }

  async getUserReportLogs(dto: FetchUserReportLogsDto) {
    const { page, limit, startDate, endDate } = dto;

    const [count, nodes] = await Promise.all([
      this.prisma.userReportLog.count({
        where: {
          createdAt: {
            ...(startDate && { gt: startDate }),
            ...(endDate && { lt: endDate }),
          },
          reportedUser: {
            bannedAt: null,
          },
        },
      }),
      this.prisma.userReportLog.findMany({
        where: {
          createdAt: {
            ...(startDate && { gt: startDate }),
            ...(endDate && { lt: endDate }),
          },
          reportedUser: {
            bannedAt: null,
          },
        },
        include: {
          reportedUser: true,
          reporter: true,
        },
        take: limit,
        skip: limit * (page - 1),
      }),
    ]);

    return { nodes, count };
  }
}
