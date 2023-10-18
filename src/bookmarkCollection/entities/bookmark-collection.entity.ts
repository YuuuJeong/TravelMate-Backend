import { BookmarkCollection, Visibility } from '@prisma/client';
export class BookmarkCollectionEntity implements BookmarkCollection {
  id: number;
  title: string;
  userId: number;
  visibility: Visibility;
  createdAt: Date;
  updatedAt: Date;
}
