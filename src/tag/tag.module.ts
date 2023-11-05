import { Module } from '@nestjs/common';
import { TagController } from './tag.controller';
import { TagService } from './tag.service';
import { PrismaService } from 'src/prisma.service';

@Module({
  imports: [],
  controllers: [TagController],
  providers: [PrismaService, TagService],
  exports: [TagService],
})
export class TagModule {}
