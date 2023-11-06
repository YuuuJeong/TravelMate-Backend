import { ApiProperty } from '@nestjs/swagger';
import { Period } from '@prisma/client';
import { Validate } from 'class-validator';

export const locations = [
  '서울',
  '경기/인천',
  '강원',
  '충청/대전',
  '전라/광주',
  '경북/대구',
  '경남/울산/부산',
  '제주',
];

export class CreateArticleDto {
  @ApiProperty({
    description: 'title',
  })
  title: string;

  @ApiProperty({
    description: 'period',
    enum: Period,
  })
  period: Period;

  @ApiProperty({
    description: 'location',
  })
  @Validate((l) => {
    return locations.includes(l);
  })
  location: string;

  @ApiProperty({
    description: 'thumbnail image',
  })
  thumbnail: string;

  @ApiProperty({
    description: 'content',
  })
  content: string;

  @ApiProperty({
    description: 'tagIds',
  })
  tagIds: number[];
}
