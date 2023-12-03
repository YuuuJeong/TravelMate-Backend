import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber } from 'class-validator';

export class OffsetPaginationDto {
  @ApiProperty({
    description: '불러올 페이지 번호(기본값: 1)',
    required: false,
  })
  @Type(() => Number)
  @IsNumber()
  page: number = 1;

  @ApiProperty({
    description: '한 페이지당 최대 수(기본값: 25)',
    required: false,
  })
  @Type(() => Number)
  @IsNumber()
  limit: number = 25;
}
