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
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AdminService } from './admin.service';
import { JwtAuthGuard } from 'src/auth/strategies/jwt.strategy';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { AdminGuard } from 'src/common/guards/admin.guard';
import { UserReportLogService } from '../userReportLog/user-report-log.service';
import { FetchUserReportLogsDto } from './dtos/fetch-user-report-logs.dto';
import { UserService } from 'src/user/user.service';
import { OffsetPaginationDto } from 'src/common/dtos/offset-pagination.dto';
import { ArticleReportLogService } from 'src/articleReportLog/article-report-log.service';

@Controller('admin')
@ApiTags('Admin')
export class AdminController {
  constructor(
    private readonly adminService: AdminService,
    private readonly userReportLogService: UserReportLogService,
    private readonly userService: UserService,
    private readonly articleReportLogService: ArticleReportLogService,
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

  @ApiOperation({
    description: '유저를 정지시키는 API',
  })
  @ApiParam({
    name: 'userId',
    type: Number,
    required: true,
  })
  @ApiBody({
    schema: {
      example: {
        reason: '왜 그러셨어요',
      },
    },
  })
  @Post('/ban/user/:userId')
  @ApiBearerAuth()
  @UseGuards(AdminGuard)
  @UseGuards(JwtAuthGuard)
  async banUser(
    @Param('userId', ParseIntPipe) userId: number,
    @Body('reason') reason: string,
  ) {
    return await this.adminService.banUser(userId, reason);
  }

  @ApiOperation({
    description:
      '유저 목록을 조회하는 API (페이지네이션 있음) bannedAt이 null이 아니라면 정지된 유저임 유저목록 뿌려줄 때 식별',
  })
  @Get('users')
  @ApiBearerAuth()
  @UseGuards(AdminGuard)
  @UseGuards(JwtAuthGuard)
  async getUsers(@Query() dto: OffsetPaginationDto) {
    return await this.adminService.getAllUsers(dto);
  }

  @ApiOperation({
    description:
      '유저 목록을 조회하는 API (페이지네이션 있음) bannedAt이 null이 아니라면 정지된 유저임 유저목록 뿌려줄 때 식별',
  })
  @Get('article-report-logs')
  @ApiBearerAuth()
  @UseGuards(AdminGuard)
  @UseGuards(JwtAuthGuard)
  async getArticleReportLogs(@Query() dto: OffsetPaginationDto) {
    return await this.articleReportLogService.getArticleReportLogs(dto);
  }
}
