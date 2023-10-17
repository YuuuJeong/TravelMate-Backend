import { Module } from '@nestjs/common';
import { BookmarkCollectionModule } from 'src/bookmarkCollection/bookmark-collection.module';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  imports: [BookmarkCollectionModule],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
