import { Module } from '@nestjs/common';

import { PrismaService } from 'src/prisma.service';
import { FriendController } from './friend.controller';
import { FriendService } from './friend.service';

@Module({
  imports: [],
  controllers: [FriendController],
  providers: [PrismaService, FriendService],
  exports: [FriendService],
})
export class FriendModule {}
