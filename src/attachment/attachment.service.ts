import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { S3Service } from 'src/s3/s3.service';

export enum UploadState {
  PENDING = 'PENDING',
  READY = 'READY',
  ERROR = 'ERROR',
}

@Injectable()
export class AttachmentService {
  constructor(
    private prisma: PrismaService,
    private s3Service: S3Service,
  ) {}

  public async getAttachmentUrl(type: string, attachmentID: number) {
    const attachment = await this.prisma.attachment.findUnique({
      where: { id: attachmentID },
    });

    if (!attachment || attachment.state !== UploadState.READY) {
      return null;
    }

    const key = attachment.id;

    //TODO : env
    return `https://d1xeo9u48cowhw.cloudfront.net/${type}/${key}`;
    // return `${AWS_MEDIA_CLOUDFRONT_BASE_URL}/${key}${querystring}`;
  }
}
