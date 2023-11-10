import { ApiProperty } from '@nestjs/swagger';
import { Visibility } from '@prisma/client';
import { Transform } from 'class-transformer';
import { OffsetPaginationDto } from 'src/common/dtos/offset-pagination.dto';

export class FetchMyBookmarkCollectionDto extends OffsetPaginationDto {
  @ApiProperty({
    example: 'FRIENDS_ONLY',
    description:
      '공개 여부 -> PRIVATE(비공개) / FRIENDS_ONLY(친구에게만) / PUBLIC(모두 공개) /빈문자열은 전체 다 가져오도록 ',
    required: false,
  })
  @Transform(({ value }) => value.toUpperCase())
  @Transform(({ value }) => (value === Visibility.ALL ? undefined : value))
  visibility?: Visibility;
}
