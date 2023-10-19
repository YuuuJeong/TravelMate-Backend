import { ApiProperty } from '@nestjs/swagger';

export class SignUpDto {
  @ApiProperty({
    example: '01012345679',
  })
  phoneNumber: string;

  @ApiProperty({
    example: 'test1234',
  })
  nickname: string;
}
