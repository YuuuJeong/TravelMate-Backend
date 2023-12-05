import { Injectable } from '@nestjs/common';
import * as AWS from '@aws-sdk/client-s3';
import { ConfigService } from '@nestjs/config';
import { GetObjectCommand, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { PrismaService } from 'src/prisma.service';
import { EPresignedPostType } from './dtos/get-presigned-post.dto';

@Injectable()
export class S3Service {
  private client: AWS.S3Client;
  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
  ) {
    this.client = new AWS.S3Client({
      region: 'ap-northeast-2',
      credentials: {
        accessKeyId: configService.getOrThrow('aws.accessKeyId'),
        secretAccessKey: configService.getOrThrow('aws.secretAccessKey'),
      },
    });
  }

  async getPresignedUrl(type: string, key: number): Promise<string> {
    const command = new GetObjectCommand({
      Bucket: this.configService.getOrThrow('aws.bucketName'),
      ResponseContentType: 'image/*',
      Key: `${type}/${key}`,
    });
    const url = await getSignedUrl(this.client, command, { expiresIn: 3600 });
    return url;
  }

  async getPresignedPost(
    userId: number,
    type: EPresignedPostType,
  ): Promise<any> {
    let resultId: number;
    switch (type) {
      case EPresignedPostType.ARTICLE:
        const attachment = await this.prisma.attachment.create({
          data: {
            bucket: this.configService.getOrThrow('aws.bucketName'),
            state: 'PENDING',
            type: 'ARTICLE',
          },
        });
        resultId = attachment.id;
        break;
      case EPresignedPostType.THUMBNAIL:
        const thumbnail = await this.prisma.attachment.create({
          data: {
            bucket: this.configService.getOrThrow('aws.bucketName'),
            state: 'PENDING',
            type: 'THUMBNAIL',
          },
        });
        resultId = thumbnail.id;
        break;
      case EPresignedPostType.PROFILE:
        const profileImage = await this.prisma.profileImage.create({
          data: {
            User: {
              connect: {
                id: userId,
              },
            },
            bucket: this.configService.getOrThrow('aws.bucketName'),
            state: 'PENDING',
          },
        });
        resultId = profileImage.id;
        break;
      case EPresignedPostType.CHAT:
        const chatImage = await this.prisma.attachment.create({
          data: {
            bucket: this.configService.getOrThrow('aws.bucketName'),
            state: 'PENDING',
            type: 'CHAT',
          },
        });
        resultId = chatImage.id;
        break;
    }

    const command = new PutObjectCommand({
      Bucket: this.configService.getOrThrow('aws.bucketName'),
      ContentType: 'image/*',
      Key: `${type}/${resultId}`,
    });
    const url = await getSignedUrl(this.client, command, { expiresIn: 3600 });

    return { url, id: resultId };
  }

  public async uploadSuccess(type: string, id: number) {
    return type === 'article' || type === 'thumbnail' || type === 'chat'
      ? await this.prisma.attachment.update({
          where: { id },
          data: {
            state: 'READY',
          },
        })
      : await this.prisma.profileImage.update({
          where: { id },
          data: {
            state: 'READY',
          },
        });
  }
}
