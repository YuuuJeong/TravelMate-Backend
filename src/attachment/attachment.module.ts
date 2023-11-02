import { Module } from '@nestjs/common';
import { AttachmentController } from './attachment.controller';
import { AttachmentService } from './attachment.service';
import { PrismaService } from 'src/prisma.service';
import { S3Module } from 'src/s3/s3.module';

@Module({
  imports: [S3Module],
  controllers: [AttachmentController],
  providers: [PrismaService, AttachmentService],
  exports: [AttachmentService],
})
export class AttachmentModule {}
