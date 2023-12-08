import { Injectable } from '@nestjs/common';
import { OffsetPaginationDto } from 'src/common/dtos/offset-pagination.dto';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class ArticleReportLogService {
  constructor(private prisma: PrismaService) {}
  async reportArticle(userId: number, articleId: number, reason: string) {
    return await this.prisma.articleReportLog.create({
      data: {
        reporterId: userId,
        articleId,
        reason,
      },
    });
  }

  async getArticleReportLogs(dto: OffsetPaginationDto) {
    const count = await this.prisma.articleReportLog.count({
      where: {
        article: {
          deletedAt: null,
        },
      },
    });
    const nodes = await this.prisma.articleReportLog.findMany({
      where: {
        article: {
          deletedAt: null,
        },
      },
      include: {
        articleReporter: true,
        article: true,
      },
      take: dto.limit,
      skip: (dto.page - 1) * dto.limit,
    });

    return { count, nodes };
  }
}
