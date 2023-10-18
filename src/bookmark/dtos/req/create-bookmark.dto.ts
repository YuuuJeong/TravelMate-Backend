import { ApiProperty } from '@nestjs/swagger';

export class CreateBookmarkDto {
  @ApiProperty({
    example: '여기 맛집이더라',
    description: '위치에 대한 메모',
  })
  content?: string;

  @ApiProperty({
    example: 1,
    description: '위치 id',
  })
  locationId: number;
}
