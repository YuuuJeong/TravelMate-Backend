import { Bookmark } from '@prisma/client';
import { LocationEntity } from 'src/location/entities/location.entity';
export class BookmarkEntity implements Bookmark {
  createdAt: Date;
  deletedAt: Date | null;
  id: number;
  userId: number;
  content: string;
  locationId: number;
  location?: Partial<LocationEntity>;
}
