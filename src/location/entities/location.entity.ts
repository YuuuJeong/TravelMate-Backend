import { Location, Prisma } from '@prisma/client';

export class LocationEntity implements Location {
  id: number;
  latitude: Prisma.Decimal;
  longitude: Prisma.Decimal;
}
