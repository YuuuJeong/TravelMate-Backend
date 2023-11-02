import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { S3Service } from './s3.service';
import { GetPresignedPostDto } from './dtos/get-presigned-post.dto';
import { JwtAuthGuard } from 'src/auth/strategies/jwt.strategy';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { User } from '@prisma/client';

@Controller('s3')
@ApiTags('s3')
export class S3Controller {
  constructor(private readonly s3Service: S3Service) {}

  @ApiOperation({
    summary: 'S3 presigned post',
  })
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get('presigned-post')
  async getPresignedPost(
    @CurrentUser() user: User,
    @Query() dto: GetPresignedPostDto,
  ) {
    return await this.s3Service.getPresignedPost(1, dto.type);
  }

  @ApiOperation({
    summary: 'Upload success',
  })
  @Get('upload-success')
  async uploadSuccess(@Query('type') type: string, @Query('id') id: number) {
    return this.s3Service.uploadSuccess(type, id);
  }
}
