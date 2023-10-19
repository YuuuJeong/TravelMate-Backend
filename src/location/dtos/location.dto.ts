import { Decimal } from '@prisma/client/runtime/library';
import { Exclude, Expose } from 'class-transformer';

export class LocationDto {
  @Exclude()
  id: number;

  @Expose()
  latitude: Decimal;

  @Expose()
  longitude: Decimal;
}
