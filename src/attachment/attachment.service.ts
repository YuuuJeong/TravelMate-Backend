import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { S3Service } from 'src/s3/s3.service';

@Injectable()
export class AttachmentService {
  constructor(
    private prisma: PrismaService,
    private s3: S3Service,
  ) {}

  public async getAttachmentUrl(attachmentID: number) {
    const attachment = await this.prisma.attachment.findUnique({
      where: { id: attachmentID },
    });

    if (!attachment || attachment.state !== UploadState.READY) {
      return null;
    }

    const key = attachment.id.toString();

    // return `${AWS_MEDIA_CLOUDFRONT_BASE_URL}/${key}${querystring}`;
    return this.s3.getPresignedUrl(key);
  }
}
