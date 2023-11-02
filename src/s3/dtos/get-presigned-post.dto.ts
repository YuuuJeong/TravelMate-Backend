import { ApiProperty } from '@nestjs/swagger';

export enum EPresignedPostType {
  ARTICLE = 'article',
  PROFILE = 'profile',
}

export class GetPresignedPostDto {
  @ApiProperty({
    example: 'article',
    description: 'type',
    enum: EPresignedPostType,
  })
  type: EPresignedPostType;
}
