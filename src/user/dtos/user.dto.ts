import { ApiProperty } from '@nestjs/swagger';
import { User, UserLevel } from '@prisma/client';
import { Transform } from 'class-transformer';
export class UserDto implements User {
  @ApiProperty()
  id: number;
  @ApiProperty()
  nickname: string | null;
  @ApiProperty()
  provider: string;
  @ApiProperty()
  providerId: string;
  @ApiProperty()
  profileImageId: number | null;

  @ApiProperty()
  level: UserLevel;

  @ApiProperty()
  createdAt: Date;
  @ApiProperty()
  updatedAt: Date;

  @ApiProperty()
  @Transform(
    ({ value }) => {
      return value;
    },
    { toPlainOnly: true },
  )
  profileImageUrl: string | null;

  constructor(data: Partial<UserDto>) {
    Object.assign(this, data);

    if (this.profileImageId) {
      this.profileImageUrl = `https://d1xeo9u48cowhw.cloudfront.net/profile/${this.profileImageId}`;
    }
  }
}
