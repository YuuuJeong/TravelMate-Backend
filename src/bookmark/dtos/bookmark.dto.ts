import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose, Type } from 'class-transformer';
import { LocationDto } from 'src/location/dtos/location.dto';
import { LocationEntity } from '../../location/entities/location.entity';

export class BookmarkDto {
  @ApiProperty({
    example: 1,
    description: '북마크 컬렉션 id',
  })
  @Expose()
  id: number;

  @Expose()
  content?: string | null;

  @Exclude()
  locationId: number;

  @Expose()
  createdAt: Date;

  @Exclude()
  deletedAt: Date | null;

  @Expose()
  @Type(() => LocationDto)
  location?: Partial<LocationEntity>;
}
