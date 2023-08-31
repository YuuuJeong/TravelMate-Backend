import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Length,
  Matches,
} from 'class-validator';

export class LocalSignUpDto {
  @ApiProperty({
    example: 'dbwjdgh03@ajou.ac.kr',
  })
  @IsNotEmpty({ message: '이메일이 누락되었습니다.' })
  @IsEmail({}, { message: '이메일 형식이 아닙니다.' })
  email: string;

  @ApiProperty({
    example: 'abcd123!',
  })
  @IsNotEmpty({ message: '비밀번호가 누락되었습니다.' })
  @IsString({ message: '문자열 형식이 아닙니다.' })
  @Matches(/^(?=.*[a-zA-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,20}$/, {
    message:
      '비밀번호는 최소 8자 이상 최대 20자이하 이어야 하며, 알파벳, 숫자, 특수문자를 포함해야 합니다.',
  })
  password: string;

  @ApiProperty({
    example: '유쟁',
  })
  @IsNotEmpty({ message: '닉네임이 누락되었습니다.' })
  @IsString({ message: '문자열 형식이 아닙니다.' })
  @Length(2, 8, { message: '닉네임은 최소 2자에서 최대 8자여야 합니다.' })
  nickname: string;
}
