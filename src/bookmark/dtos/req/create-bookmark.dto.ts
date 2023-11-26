import { ApiProperty } from '@nestjs/swagger';
import { LocationWithContent } from 'src/bookmarkCollection/dtos/req/update-bookmark-collection.dto';

export class CreateBookmarkDto {
  @ApiProperty({
    example: [
      {
        latitude: 12.52,
        longitude: 10.1,
        placeId: 'ChIJ-b-cvCxdezURhkcMDVqEYuk',
        content: '뭘까용?',
      },
    ],
    description: '북마크로 추가 할 위도, 경도, 장소메모 ',
  })
  locationsWithContent: LocationWithContent[];
}
