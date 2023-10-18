import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class BookmarkDto {
  @ApiProperty({
    example: 1,
    description: '북마크 컬렉션 id',
  })
  @Expose()
  id: number;

  content?: string | null;
  locationId: number;
  createdAt: Date;
  deletedAt: Date | null;
}
