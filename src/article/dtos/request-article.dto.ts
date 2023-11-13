import { ApiProperty } from '@nestjs/swagger';
import { Period } from '@prisma/client';
import { IsEnum, IsString } from 'class-validator';

export class RequestArticleDto {
  @ApiProperty({
    description: 'content',
  })
  @IsString()
  content: string;

  @ApiProperty({
    description: 'Period',
    enum: Period,
  })
  @IsEnum(Period)
  period: Period;
}
