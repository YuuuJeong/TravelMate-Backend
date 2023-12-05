import { Module } from '@nestjs/common';
import { UserReportLogController } from './user-report-log.controller';
import { UserReportLogService } from './user-report-log.service';
import { PrismaService } from 'src/prisma.service';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [UserModule],
  controllers: [UserReportLogController],
  providers: [PrismaService, UserReportLogService],
  exports: [UserReportLogService],
})
export class UserReportLogModule {}
