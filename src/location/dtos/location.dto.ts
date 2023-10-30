import { Exclude, Expose } from 'class-transformer';

export class LocationDto {
  @Exclude()
  id: number;

  @Expose()
  latitude: number;

  @Expose()
  longitude: number;
}
