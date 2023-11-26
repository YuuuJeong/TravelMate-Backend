import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { RedisModule } from './redis/redis.module';
import jwtConfig from './config/jwt.config';
import redisConfig from './config/redis.config';
import { S3Module } from './s3/s3.module';
import awsConfig from './config/aws.config';
import { AttachmentModule } from './attachment/attachment.module';
import { TagModule } from './tag/tag.module';
import { ArticleModule } from './article/article.module';
import { FriendModule } from './friend/friend.module';
import { BookmarkModule } from './bookmark/bookmark.module';
import { ChatBookmarkCollectionModule } from './chatBookmarkCollection/chat-bookmark-collection.module';

@Module({
  imports: [
    AuthModule,
    UserModule,
    ConfigModule.forRoot({
      isGlobal: true,
      expandVariables: true,
      envFilePath: process.env.NODE_ENV
        ? `.env.${process.env.NODE_ENV}`
        : '.env',
      load: [jwtConfig, redisConfig, awsConfig],
    }),
    RedisModule,
    S3Module,
    AttachmentModule,
    TagModule,
    ArticleModule,
    FriendModule,
    BookmarkModule,
    ChatBookmarkCollectionModule,
  ],
  controllers: [AppController],
  providers: [AppService, ConfigService],
})
export class AppModule {}
