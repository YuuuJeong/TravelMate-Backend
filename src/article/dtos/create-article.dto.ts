import { ApiProperty } from '@nestjs/swagger';
import { Period } from '@prisma/client';

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
    description: 'content',
  })
  content: string;

  @ApiProperty({
    description: 'tagIds',
  })
  tagIds: number[];
}
