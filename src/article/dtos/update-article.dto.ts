import { ApiProperty } from '@nestjs/swagger';
import { Period } from '@prisma/client';
import { Location } from './create-article.dto';

export class UpdateArticleDto {
  @ApiProperty({
    required: true,
  })
  articleId: number;

  @ApiProperty({
    required: false,
  })
  title: string;

  @ApiProperty({
    required: false,
    enum: Location,
  })
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
  period: Period;
}
