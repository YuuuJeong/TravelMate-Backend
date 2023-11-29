import { ApiProperty } from '@nestjs/swagger';
import { Period } from '@prisma/client';
import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';

export class RequestArticleDto {
  @ApiProperty({
    description: 'content',
  })
  @IsString()
  content: string;

  @ApiProperty({
    description: 'comment',
  })
  @IsOptional()
  @IsString()
  comment?: string;

  @ApiProperty({
    description: 'Period',
    enum: Period,
  })
  @IsEnum(Period)
  period: Period;

  @ApiProperty({
    description: 'Bookmark ids',
    isArray: true,
    type: 'number',
  })
  @IsOptional()
  @IsNumber({}, { each: true })
  bookmarkIds?: number[];
}
