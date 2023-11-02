import { Module } from '@nestjs/common';
import { S3Controller } from './s3.controller';
import { S3Service } from './s3.service';
import { PrismaService } from 'src/prisma.service';

@Module({
  imports: [],
  controllers: [S3Controller],
  providers: [S3Service, PrismaService],
  exports: [S3Service],
})
export class S3Module {}
