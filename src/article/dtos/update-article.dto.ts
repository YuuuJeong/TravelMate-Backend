import { ApiProperty } from '@nestjs/swagger';
import { Period } from '@prisma/client';
import { Location } from './create-article.dto';
import { IsEnum } from 'class-validator';

export class UpdateArticleDto {
  @ApiProperty({
    required: false,
  })
  title: string;

  @ApiProperty({
    required: false,
    enum: Location,
  })
  @IsEnum(Location)
  location: Location;

  @ApiProperty({
    required: false,
  })
  thumbnail: string;

  @ApiProperty({
    required: false,
    type: [Number],
  })
  tagIds: number[];

  @ApiProperty({
    required: false,
    enum: Period,
  })
  @IsEnum(Period)
  period: Period;

  @ApiProperty({
    required: false,
  })
  content: string;

  @ApiProperty({
    description: 'Bookmark ids',
    type: [Number],
  })
  bookmarkIds: number[];
}
