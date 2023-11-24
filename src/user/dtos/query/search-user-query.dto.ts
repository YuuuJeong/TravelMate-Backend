import { ApiProperty } from '@nestjs/swagger';
import { UserNicknameDto } from '../req/user-nickname.dto';
import { Transform, Type } from 'class-transformer';
import { IsInt } from 'class-validator';

export class SearchUserQueryDto extends UserNicknameDto {
  @ApiProperty({
    example: [1, 2, 3],
  })
  @Transform(({ value }) => value.split(','))
  @IsInt()
  @Type(() => Number)
  memberIds: number[];
}
