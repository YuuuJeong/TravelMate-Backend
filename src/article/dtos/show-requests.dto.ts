import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';

enum PeriodOrAll {
  ALL = 'ALL',
  SPRING = 'SPRING',
  SUMMER = 'SUMMER',
  FALL = 'FALL',
  WINTER = 'WINTER',
}

export class ShowRequestsDto {
  @ApiProperty({
    enum: PeriodOrAll,
  })
  @IsEnum(PeriodOrAll)
  period: PeriodOrAll;
}
