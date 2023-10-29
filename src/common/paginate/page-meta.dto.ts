import { ApiProperty } from '@nestjs/swagger';
import { PaginateQueryDto } from './paginate-query.dto';

export class PageMetaDto {
  @ApiProperty()
  readonly page: number;

  @ApiProperty()
  readonly pageSize: number;

  @ApiProperty()
  readonly totalCount: number;

  @ApiProperty()
  readonly pageCount: number;

  @ApiProperty()
  readonly hasPreviousPage: boolean;

  @ApiProperty()
  readonly hasNextPage: boolean;

  constructor(paginateQueryDto: PaginateQueryDto, totalCount: number) {
    this.page = paginateQueryDto.page!;
    this.pageSize = paginateQueryDto.pageSize!;
    this.totalCount = totalCount;
    this.pageCount = Math.ceil(this.totalCount / this.pageSize);
    this.hasPreviousPage = this.page > 1;
    this.hasNextPage = this.page < this.pageCount;
  }
}
