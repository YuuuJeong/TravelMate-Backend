import { Bookmark, BookmarkCollection, Visibility } from '@prisma/client';
import { CreateBookmarkCollectionRequestDTO } from '../dtos/req/create-bookmark-collection.dto';
import { UpdateBookmarkCollectionRequestDTO } from '../dtos/req/update-bookmark-collection.dto';
import { Decimal } from '@prisma/client/runtime/library';
import { FetchMyBookmarkCollectionDto } from '../dtos/req/fetch-my-bookmark-collections.dto';

export const collection: BookmarkCollection = {
  id: 1,
  title: '이거 뭐에요?',
  userId: 4,
  visibility: Visibility.PUBLIC,
  createdAt: new Date(),
  updatedAt: new Date(),
};

export const createDto: CreateBookmarkCollectionRequestDTO = {
  title: '이거 뭐에요?',
  visibility: Visibility.PUBLIC,
};

export const bookmark: Bookmark = {
  createdAt: new Date(),
  deletedAt: null,
  id: 1,
  userId: 4,
  content: '테스트',
  locationId: 5,
};

export const deletedBookmark: Bookmark = {
  createdAt: new Date(),
  deletedAt: new Date(),
  id: 1,
  userId: 4,
  content: '테스트',
  locationId: 5,
};

export const updateBookmarkCollectionDto: UpdateBookmarkCollectionRequestDTO = {
  title: '테스트',
  visibility: Visibility.PUBLIC,
  bookmarkIdsToDelete: [1, 2, 3],
  locationsWithContent: [
    {
      latitude: new Decimal(4.5),
      longitude: new Decimal(4.6),
      content: 'ㅎㅇㅎㅇ',
    },
    {
      latitude: new Decimal(4.7),
      longitude: new Decimal(4.8),
      content: 'ㅂㅇㅂㅇ',
    },
  ],
};

export const paginationDto: FetchMyBookmarkCollectionDto = {
  page: 1,
  limit: 10,
  visibility: Visibility.PUBLIC,
};
