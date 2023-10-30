import { Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class PaginatedDto<T> {
  constructor(nodes: T[], count: number) {
    this.nodes = nodes;
    this.count = count;
  }

  @Expose()
  @ApiProperty({
    type: () => [Object],
    description: '페이지에 해당하는 데이터',
  })
  public nodes: T[];

  @ApiProperty()
  readonly count: number;
}
