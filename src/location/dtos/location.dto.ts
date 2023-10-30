import { Exclude, Expose } from 'class-transformer';
import { Prisma } from '@prisma/client';

export class LocationDto {
  @Exclude()
  id: number;

  @Expose()
  latitude: Prisma.Decimal;

  @Expose()
  longitude: Prisma.Decimal;
}
