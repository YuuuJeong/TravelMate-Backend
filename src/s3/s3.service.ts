import { Injectable } from '@nestjs/common';
import * as AWS from '@aws-sdk/client-s3';
import { ConfigService } from '@nestjs/config';
import { v4 as uuidV4 } from 'uuid';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

@Injectable()
export class S3Service {
  private client: AWS.S3Client;
  constructor(private readonly configService: ConfigService) {
    this.client = new AWS.S3Client({
      region: 'ap-northeast-2',
      credentials: {
        accessKeyId: configService.getOrThrow('aws.accessKeyId'),
        secretAccessKey: configService.getOrThrow('aws.secretAccessKey'),
      },
    });
  }

  async getPresignedUrl(key: string): Promise<string> {
    const command = new PutObjectCommand({
      Bucket: this.configService.getOrThrow('aws.bucketName'),
      Key: key,
      ContentLength: 1024 * 1024 * 10,
      ACL: 'public-read',
    });
    const url = await getSignedUrl(this.client, command, { expiresIn: 3600 });
    return url;
  }

  async getPresignedPost(type: string): Promise<any> {
    const uuid = uuidV4();

    const command = new PutObjectCommand({
      Bucket: this.configService.getOrThrow('aws.bucketName'),
      Key: `${type}/${uuid}`,
      ContentLength: 1024 * 1024 * 10,
      ACL: 'public-read',
    });
    const url = await getSignedUrl(this.client, command, { expiresIn: 3600 });

    return { url, uuid };
  }
}
