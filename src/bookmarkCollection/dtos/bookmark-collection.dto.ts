import { ApiProperty } from '@nestjs/swagger';
import { Visibility } from '@prisma/client';
import { Expose } from 'class-transformer';

export class BookmarkCollectionDto {
  @ApiProperty({
    example: 1,
    description: '북마크 컬렉션 id',
  })
  @Expose()
  id: number;

  @ApiProperty({
    example: '강릉 맛집',
    description: '북마크 컬렉션 제목',
  })
  @Expose()
  title: string;

  @ApiProperty({
    example: 'FRIENDS_ONLY',
    description: '공개 여부',
    enum: Visibility,
  })
  @Expose()
  visibility: Visibility;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;
}
