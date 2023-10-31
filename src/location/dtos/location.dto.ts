import { Exclude, Expose } from 'class-transformer';
import { Decimal } from '@prisma/client/runtime/library';

export class LocationDto {
  @Exclude()
  id: number;

  @Expose()
  latitude: Decimal;

  @Expose()
  longitude: Decimal;
}
