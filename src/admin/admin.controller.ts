import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AdminService } from './admin.service';
import { JwtAuthGuard } from 'src/auth/strategies/jwt.strategy';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { AdminGuard } from 'src/common/guards/admin.guard';
import { UserReportLogService } from '../userReportLog/user-report-log.service';
import { FetchUserReportLogsDto } from './dtos/fetch-user-report-logs.dto';

@Controller('admin')
@ApiTags('Admin')
export class AdminController {
  constructor(
    private readonly adminService: AdminService,
    private readonly userReportLogService: UserReportLogService,
  ) {}

  @ApiOperation({
    description:
      '관리자인지 아닌지 확인하는 API (실제 서비스에서는 사용안함 테스트용)',
  })
  @Get()
  @ApiBearerAuth()
  @UseGuards(AdminGuard)
  @UseGuards(JwtAuthGuard)
  getHello(): string {
    return '관리자이시네요';
  }

  @ApiOperation({
    description: '유저 신고 목록 조회하는 API',
  })
  @Get('user-report-logs')
  @ApiBearerAuth()
  @UseGuards(AdminGuard)
  @UseGuards(JwtAuthGuard)
  async getUserReportLogs(@Query() dto: FetchUserReportLogsDto) {
    return await this.userReportLogService.getUserReportLogs(dto);
  }
}
