import { Module } from '@nestjs/common';
import { ArticleController } from './article.controller';
import { ArticleService } from './article.service';
import { PrismaService } from 'src/prisma.service';
import { ArticleReportLogModule } from 'src/articleReportLog/article-report-log.module';

@Module({
  imports: [ArticleReportLogModule],
  controllers: [ArticleController],
  providers: [ArticleService, PrismaService],
  exports: [ArticleService],
})
export class ArticleModule {}
