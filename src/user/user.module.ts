import { Module } from '@nestjs/common';
import { BookmarkModule } from 'src/bookmark/bookmark.module';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  imports: [BookmarkModule],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
