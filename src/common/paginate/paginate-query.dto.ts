import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

export class PaginateQueryDto {
  @ApiProperty({
    example: 1,
    description: '페이지 번호',
    required: false,
  })
  @Transform(({ value }) => Number.parseInt(value))
  page?: number;

  @ApiProperty({
    example: 15,
    description: '페이지 사이즈',
    required: false,
  })
  @Transform(({ value }) => Number.parseInt(value))
  pageSize?: number;
}
