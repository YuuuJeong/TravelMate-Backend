import { Bookmark } from '@prisma/client';
import { LocationEntity } from 'src/location/entities/location.entity';
export class BookmarkEntity implements Bookmark {
  createdAt: Date;
  deletedAt: Date | null;
  id: number;
  content: string | null;
  locationId: number;
  location?: Partial<LocationEntity>;
}
