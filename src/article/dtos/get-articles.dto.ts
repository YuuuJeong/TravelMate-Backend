import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
  IsEnum,
  isEnum,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { Location } from './create-article.dto';

export enum ArticleOrderField {
  TITLE_DESCENDING = 'titleDescending',
  TITLE_ASCENDING = 'titleAscending',
  RECENT = 'recent',
}

export class GetArticlesDto {
  @ApiProperty({
    required: false,
    description: 'default:0',
  })
  @Type(() => Number)
  @IsNumber()
  page: number = 1;

  @ApiProperty({
    required: false,
  })
  @Type(() => Number)
  @IsNumber()
  limit: number = 10;

  @ApiProperty({
    required: false,
  })
  @Type(() => Number)
  @IsOptional()
  @IsNumber()
  authorId?: number;

  @ApiProperty({
    required: false,
  })
  @IsOptional()
  @IsString()
  period?: string;

  @ApiProperty({
    required: false,
    enum: Location,
  })
  @IsEnum(Location)
  @IsOptional()
  @IsString()
  location?: Location;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  keyword?: string;

  @ApiProperty({
    required: false,
    enum: ArticleOrderField,
  })
  @IsString()
  @IsOptional()
  @Transform(({ value }) => {
    if (isEnum(value, ArticleOrderField)) {
      return value;
    }

    return 'recent';
  })
  order?: ArticleOrderField;
}
