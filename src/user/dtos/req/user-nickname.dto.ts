import { ApiProperty } from '@nestjs/swagger';
import { IsString, Length, Matches } from 'class-validator';

export class UserNicknameDto {
  @ApiProperty({
    example: 'test22',
  })
  @IsString()
  @Length(2, 15, { message: '닉네임은 2자이상 15자이하로 구성해주세요.' })
  @Matches(/^[A-Za-z가-힣\d\s]+$/, {
    message:
      '닉네임은 알파뱃 대소문자, 한글, 숫자 조합한 문자열로 구성해야 하며, 문자열 사이 공백은 허용합니다.',
  })
  nickname: string;
}
