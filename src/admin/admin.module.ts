import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { PrismaService } from 'src/prisma.service';
import { UserModule } from 'src/user/user.module';
import { UserReportLogModule } from 'src/userReportLog/user-report-log.module';
import { ArticleReportLogModule } from 'src/articleReportLog/article-report-log.module';

@Module({
  imports: [UserModule, UserReportLogModule, ArticleReportLogModule],
  controllers: [AdminController],
  providers: [PrismaService, AdminService],
  exports: [AdminService],
})
export class AdminModule {}
