import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional } from 'class-validator';

export class GetMyRequestsDto {
  @ApiProperty({
    description: '요청 상태',
    enum: ['pending', 'accepted', 'declined'],
    required: false,
  })
  @IsEnum(['pending', 'accepted', 'declined'])
  @IsOptional()
  type?: 'pending' | 'accepted' | 'declined';
}
