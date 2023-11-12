import { Module } from '@nestjs/common';
import { BookmarkService } from 'src/bookmark/bookmark.service';
import { BookmarkCollectionService } from 'src/bookmarkCollection/bookmark-collection.service';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { PrismaService } from '../prisma.service';
import { FriendService } from '../friend/friend.service';

@Module({
  imports: [],
  controllers: [UserController],
  providers: [
    UserService,
    BookmarkService,
    BookmarkCollectionService,
    PrismaService,
    FriendService,
  ],
  exports: [UserService],
})
export class UserModule {}
