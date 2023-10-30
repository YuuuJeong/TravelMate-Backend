import { Module } from '@nestjs/common';
import { AttachmentController } from './attachment.controller';
import { AttachmentService } from './attachment.service';

@Module({
  imports: [],
  controllers: [AttachmentController],
  providers: [AttachmentService],
  exports: [],
})
export class AttachmentModule {}
