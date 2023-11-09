import { ApiProperty } from '@nestjs/swagger';
import { Period } from '@prisma/client';
import { IsEnum } from 'class-validator';

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

export enum Location {
  SEOUL = '서울',
  GYEONGGI = '경기/인천',
  GANGWON = '강원',
  CHUNGCHEONG = '충청/대전',
  JEOLLA = '전라/광주',
  GYEONGBUK = '경북/대구',
  GYEONGNAM = '경남/울산/부산',
  JEJU = '제주',
}

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
    enum: Location,
  })
  @IsEnum(Location)
  location: Location;

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
