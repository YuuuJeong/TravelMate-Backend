import { Bookmark, Location } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/library';
import { LocationWithContent } from 'src/bookmarkCollection/dtos/req/update-bookmark-collection.dto';

export const bookmark: Bookmark = {
  createdAt: new Date(),
  deletedAt: new Date(),
  id: 1,
  userId: 4,
  content: '테스트',
  locationId: 5,
};

export const locationWithContent: LocationWithContent = {
  latitude: new Decimal(4.5),
  longitude: new Decimal(4.6),
  content: 'ㅎㅇㅎㅇ',
};

export const location: Location = {
  id: 1,
  latitude: new Decimal(4.5),
  longitude: new Decimal(4.6),
  placeId: null,
};
