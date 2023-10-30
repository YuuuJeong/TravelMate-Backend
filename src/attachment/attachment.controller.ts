import {
  Controller,
  Get,
  NotFoundException,
  Param,
  ParseIntPipe,
  Redirect,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AttachmentService } from './attachment.service';

@Controller('s3')
@ApiTags('s3')
export class AttachmentController {
  constructor(private readonly attachmentService: AttachmentService) {}

  @Get('/:attachmentID')
  @Redirect()
  public async getAttachment(
    @Param('attachmentID', ParseIntPipe) attachmentID: number,
  ) {
    const url = await this.attachmentService.getAttachmentUrl(attachmentID);

    if (!url) {
      throw new NotFoundException();
    }

    return {
      url,
      statusCode: 307,
    };
  }
}
