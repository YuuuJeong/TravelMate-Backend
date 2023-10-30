import { Controller, Get, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { S3Service } from './s3.service';
import { GetPresignedPostDto } from './dtos/get-presigned-post.dto';

@Controller('s3')
@ApiTags('s3')
export class S3Controller {
  constructor(private readonly s3Service: S3Service) {}

  @ApiOperation({
    summary: 'S3 presigned post',
  })
  @Get('presigned-post')
  async getPresignedPost(@Query() dto: GetPresignedPostDto) {
    return await this.s3Service.getPresignedPost(dto.type);
  }
}
