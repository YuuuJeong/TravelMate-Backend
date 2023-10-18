import { Bookmark } from '@prisma/client';
export class BookmarkEntity implements Bookmark {
  createdAt: Date;
  deletedAt: Date | null;
  id: number;
  content: string | null;
  locationId: number;
}
