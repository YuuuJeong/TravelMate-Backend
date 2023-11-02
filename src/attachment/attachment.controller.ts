import {
  Controller,
  Get,
  NotFoundException,
  Param,
  ParseIntPipe,
  Query,
  Redirect,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AttachmentService } from './attachment.service';

@Controller('attachments')
@ApiTags('attachments')
export class AttachmentController {
  constructor(private readonly attachmentService: AttachmentService) {}

  @Get('/:attachmentID')
  @ApiOperation({ summary: 'Get attachment signed url' })
  @Redirect()
  public async getAttachment(
    @Query('type') type: string,
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
