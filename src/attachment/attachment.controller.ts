import {
  Controller,
  Get,
  NotFoundException,
  Param,
  ParseIntPipe,
  Query,
  Redirect,
} from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { AttachmentService } from './attachment.service';
import { EPresignedPostType } from 'src/s3/dtos/get-presigned-post.dto';

@Controller('attachments')
@ApiTags('attachments')
export class AttachmentController {
  constructor(private readonly attachmentService: AttachmentService) {}

  @Get('/:attachmentID')
  @ApiOperation({ summary: 'Get attachment signed url' })
  @ApiQuery({
    name: 'type',
    enum: EPresignedPostType,
  })
  @Redirect()
  public async getAttachment(
    @Query('type') type: EPresignedPostType,
    @Param('attachmentID', ParseIntPipe) attachmentID: number,
  ) {
    const url = await this.attachmentService.getAttachmentUrl(
      type,
      attachmentID,
    );

    if (!url) {
      throw new NotFoundException();
    }

    return {
      url,
      statusCode: 307,
    };
  }
}
