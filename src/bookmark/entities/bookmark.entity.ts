import { Bookmark } from '@prisma/client';
export class BookmarkEntity implements Bookmark {
  id: number;
  content: string | null;
  locationId: number;
}
