import { ApiProperty } from '@nestjs/swagger';
import { Period } from '@prisma/client';
import { IsEnum } from 'class-validator';

export class ShowRequestsDto {
  @ApiProperty({
    enum: Period,
  })
  @IsEnum(Period)
  period: Period;
}
