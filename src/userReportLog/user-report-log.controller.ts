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
import { UserReportLogService } from './user-report-log.service';
import { JwtAuthGuard } from 'src/auth/strategies/jwt.strategy';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { CreateUserReportLogDto } from './dtos/create-user-report-log.dto';
import { User } from '@prisma/client';

@Controller('user-report-log')
@ApiTags('UserReports')
export class UserReportLogController {
  constructor(private readonly userReportService: UserReportLogService) {}

  @ApiOperation({
    summary: '유저 신고 완료',
  })
  @ApiResponse({
    status: 201,
    description: '유저 신고 성공',
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post('')
  async reportUser(
    @CurrentUser() user: User,
    @Body() dto: CreateUserReportLogDto,
  ) {
    return await this.userReportService.reportUser(user.id, dto);
  }
}
