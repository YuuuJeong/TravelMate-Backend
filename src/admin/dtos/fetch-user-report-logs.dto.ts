import { ApiProperty } from '@nestjs/swagger';
import {
  IsDateString,
  IsOptional,
  Validate,
  ValidateIf,
} from 'class-validator';
import { OffsetPaginationDto } from 'src/common/dtos/offset-pagination.dto';

import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';

@ValidatorConstraint({ name: 'isBefore', async: false })
export class IsBeforeConstraint implements ValidatorConstraintInterface {
  validate(propertyValue: string, args: ValidationArguments) {
    return propertyValue < args.object[args.constraints[0]];
  }

  defaultMessage(args: ValidationArguments) {
    return '시작날짜가 마지막날짜보다 더 이후 날짜입니다.';
  }
}

export class FetchUserReportLogsDto extends OffsetPaginationDto {
  @ApiProperty({
    description: '시작날짜',
    required: false,
  })
  @IsOptional()
  @Type(() => Date)
  @Transform(({ value }) => {
    return new Date(value.setHours(0, 0, 0, 0));
  })
  @Validate(IsBeforeConstraint, ['endDate'])
  startDate?: Date;

  @ApiProperty({
    description: '마지막 날짜',
    required: false,
  })
  @IsOptional()
  @Type(() => Date)
  @Transform(({ value }) => {
    return new Date(value.setHours(0, 0, 0, 0));
  })
  endDate?: Date = new Date();
}
