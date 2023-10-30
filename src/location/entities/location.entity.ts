import { Location } from '@prisma/client';

export class LocationEntity implements Location {
  id: number;
  latitude: number;
  longitude: number;
}
