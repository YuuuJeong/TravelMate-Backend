import { BadRequestException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../prisma.service';
import {
  bookmark,
  collection,
} from '../bookmarkCollection/data/bookmark-collection.data';
import { location, locationWithContent } from './data/bookmark.data';
import { BookmarkService } from './bookmark.service';
import { BookmarkCollectionService } from '../bookmarkCollection/bookmark-collection.service';

describe('BookmarkService', () => {
  let service: BookmarkService;
  let prisma: PrismaService;
  let collectionService: BookmarkCollectionService;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BookmarkService, PrismaService, BookmarkCollectionService],
    }).compile();

    service = module.get<BookmarkService>(BookmarkService);
    prisma = module.get<PrismaService>(PrismaService);
    collectionService = module.get<BookmarkCollectionService>(
      BookmarkCollectionService,
    );
  });

  it('북마크 생성시 주어진 좌표에 등록된 장소가 있다면, 해당 장소의 ID를 참조하여 북마크를 생성한다.', async () => {
    // given
    const findFirstMock = jest.fn().mockResolvedValue(location);
    const findLocationSpy = jest
      .spyOn(prisma.location, 'findFirst')
      .mockReturnValue({ findFirst: findFirstMock } as any);

    const userId = 4;
    const createLocationSpy = jest.spyOn(prisma.location, 'create');
    const createBookmarkSpy = jest
      .spyOn(prisma.bookmark, 'create')
      .mockResolvedValue(bookmark);

    // when
    await service.createBookmark(userId, locationWithContent);

    // then

    expect(findLocationSpy).toHaveBeenCalledTimes(1);
    expect(createLocationSpy).toHaveBeenCalledTimes(0);
    expect(createBookmarkSpy).toHaveBeenCalledTimes(1);
  });

  it('북마크 생성시 주어진 좌표에 등록된 장소가 없다면, 해당 장소를 생성하고 그 ID를 참조하여 북마크를 생성한다.', async () => {
    // given
    const findLocationSpy = jest
      .spyOn(prisma.location, 'findFirst')
      .mockResolvedValue(null);
    const userId = 4;
    const createLocationSpy = jest
      .spyOn(prisma.location, 'create')
      .mockResolvedValue(location);

    const createBookmarkSpy = jest.spyOn(prisma.bookmark, 'create');

    // when
    await service.createBookmark(userId, locationWithContent);

    // then

    expect(findLocationSpy).toHaveBeenCalledTimes(1);
    expect(createLocationSpy).toHaveBeenCalledTimes(1);
    expect(createBookmarkSpy).toHaveBeenCalledTimes(1);
  });

  it('특정 북마크 컬렉션안에 있는 북마크를 조회할 때, 북마크 컬렉션이 존재하지 않는다면 에러를 던진다.', async () => {
    // given
    const findUniqueCollectionSpy = jest
      .spyOn(prisma.bookmarkCollection, 'findUnique')
      .mockResolvedValue(null);

    const collectionId = 100;
    const findManyBookmarkMapSpy = jest.spyOn(
      prisma.bookmarkBookmarkCollectionMap,
      'findMany',
    );

    const findManyBookmarkSpy = jest.spyOn(prisma.bookmark, 'findMany');

    // when
    const result = async () => {
      await service.getBookmarksInCollection(collectionId);
    };

    // then

    await expect(result).rejects.toThrowError(
      new BadRequestException('존재하지 않는 북마크 컬렉션입니다.'),
    );
    expect(findUniqueCollectionSpy).toHaveBeenCalledTimes(1);
    expect(findManyBookmarkMapSpy).toHaveBeenCalledTimes(0);
    expect(findManyBookmarkSpy).toHaveBeenCalledTimes(0);
  });

  it('특정 북마크 컬렉션안에 있는 북마크를 조회할 때, 북마크 컬렉션이 존재한다면 안에 들어있는 북마크들까지 같이 조회한다..', async () => {
    // given
    const findUniqueCollectionSpy = jest
      .spyOn(prisma.bookmarkCollection, 'findUnique')
      .mockResolvedValue(collection);

    const collectionId = 100;
    const findManyBookmarkMapSpy = jest.spyOn(
      prisma.bookmarkBookmarkCollectionMap,
      'findMany',
    );

    const findManyBookmarkSpy = jest.spyOn(prisma.bookmark, 'findMany');

    // when
    await service.getBookmarksInCollection(collectionId);

    // then

    expect(findUniqueCollectionSpy).toHaveBeenCalledTimes(1);
    expect(findManyBookmarkMapSpy).toHaveBeenCalledTimes(1);
    expect(findManyBookmarkSpy).toHaveBeenCalledTimes(1);
  });
});
