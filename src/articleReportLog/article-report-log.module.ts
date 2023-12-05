import { Module } from '@nestjs/common';
import { ArticleReportLogService } from './article-report-log.service';
import { PrismaService } from 'src/prisma.service';

@Module({
  providers: [PrismaService, ArticleReportLogService],
  exports: [ArticleReportLogService],
})
export class ArticleReportLogModule {}
