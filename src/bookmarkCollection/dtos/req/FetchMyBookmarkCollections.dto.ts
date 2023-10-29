import { ApiProperty } from '@nestjs/swagger';
import { Visibility } from '@prisma/client';
import { Type } from 'class-transformer';
import { IsEnum, IsNumber, IsOptional } from 'class-validator';

export class FetchMyBookmarkCollectionDto {
  @ApiProperty({
    description: '불러올 페이지 번호(기본값: 1)',
    required: false,
  })
  @Type(() => Number)
  @IsNumber()
  page: number = 1;

  @ApiProperty({
    description: '한 페이지당 최대 문제집 수(기본값: 25)',
    required: false,
  })
  @Type(() => Number)
  @IsNumber()
  limit: number = 25;

  @ApiProperty({
    example: 'FRIENDS_ONLY',
    description:
      '공개 여부 -> PRIVATE(비공개) / FRIENDS_ONLY(친구에게만) / PUBLIC(모두 공개) ',
    enum: Visibility,
  })
  @IsOptional()
  @IsEnum(Visibility, { message: '올바른 공개 여부 값을 선택해주세요' })
  visibility: Visibility = Visibility.PUBLIC;
}
