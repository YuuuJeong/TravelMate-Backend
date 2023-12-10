import { BadRequestException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../prisma.service';
import { BookmarkCollectionService } from './bookmark-collection.service';
import {
  bookmark,
  collection,
  createDto,
  paginationDto,
  updateBookmarkCollectionDto,
} from './data/bookmark-collection.data';

describe('BookmarkCollectionService', () => {
  let service: BookmarkCollectionService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BookmarkCollectionService, PrismaService],
    }).compile();

    service = module.get<BookmarkCollectionService>(BookmarkCollectionService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('올바른 북마크 컬렉션 생성을 위한 Request DTO가 주어지면 북마크 컬렉션을 생성한다. ', async () => {
    // given
    const createSpy = jest
      .spyOn(prisma.bookmarkCollection, 'create')
      .mockResolvedValue(collection);

    const userId = 4;
    const dto = createDto;

    // when
    const result = await service.createBookmarkCollection(userId, dto);

    // then
    expect(result).toBe(collection);
    expect(createSpy).toHaveBeenCalledTimes(1);
  });

  it('북마크 컬렉션 삭제 - 존재하지 않는 북마크 컬렉션을 삭제하려고 할 때 "존재하지 않는 북마크 컬렉션이라는 메세지와 함께 에러를 던진다" ', async () => {
    // given
    jest.spyOn(prisma.bookmarkCollection, 'findUnique').mockResolvedValue(null);
    const deleteManySpyOn = jest
      .spyOn(prisma.bookmarkCollection, 'deleteMany')
      .mockResolvedValue({ count: 0 });
    const bookmarkSpyOn = jest
      .spyOn(prisma.bookmark, 'deleteMany')
      .mockResolvedValue({ count: 0 });
    const bookmarkCollectionDeleteSpyOn = jest
      .spyOn(prisma.bookmark, 'delete')
      .mockResolvedValue({
        createdAt: new Date(),
        deletedAt: null,
        id: 1,
        userId: 4,
        content: '테스트',
        locationId: 5,
      });

    const userId = 4;
    const articleId = 1000;

    // when
    const result = async () => {
      await service.removeBookmarkCollection(articleId, userId);
    };

    // then

    await expect(result).rejects.toThrowError(
      new BadRequestException('존재하지 않는 북마크 컬렉션입니다.'),
    );

    expect(deleteManySpyOn).toHaveBeenCalledTimes(0);
    expect(bookmarkSpyOn).toHaveBeenCalledTimes(0);
    expect(bookmarkCollectionDeleteSpyOn).toHaveBeenCalledTimes(0);
  });

  it('북마크 컬렉션 삭제 - 북마크 컬렉션을 소유하지 않은 사람이 삭제하려고 하면 "북마크 컬렉션의 소유자만 수정할 수 있습니다"와 같은 에러 메세지를 던진다.', async () => {
    // gien
    const collectionFind = jest
      .spyOn(prisma.bookmarkCollection, 'findUnique')
      .mockResolvedValue(collection);

    const userId = 3;
    const articleId = collection.id;

    const deleteManySpyOn = jest
      .spyOn(prisma.bookmarkCollection, 'deleteMany')
      .mockResolvedValue({ count: 0 });

    const bookmarkSpyOn = jest
      .spyOn(prisma.bookmark, 'deleteMany')
      .mockResolvedValue({ count: 0 });

    const bookmarkCollectionDeleteSpyOn = jest
      .spyOn(prisma.bookmark, 'delete')
      .mockResolvedValue(bookmark);

    // when
    const result = async () => {
      await service.removeBookmarkCollection(articleId, userId);
    };

    // then

    await expect(result).rejects.toThrowError(
      new BadRequestException('북마크 컬렉션의 소유자만 수정할 수 있습니다.'),
    );

    expect(collectionFind).toHaveBeenCalledTimes(1);
    expect(deleteManySpyOn).toHaveBeenCalledTimes(0);
    expect(bookmarkSpyOn).toHaveBeenCalledTimes(0);
    expect(bookmarkCollectionDeleteSpyOn).toHaveBeenCalledTimes(0);
  });

  it('북마크 컬렉션 삭제 - 존재하는 북마크 컬렉션을 소유자가 삭제하고자 할 때는 정상적으로 삭제가 된다.', async () => {
    // given
    const collectionFind = jest
      .spyOn(prisma.bookmarkCollection, 'findUnique')
      .mockResolvedValue(collection);

    const userId = collection.userId;
    const articleId = collection.id;

    const deleteManySpyOn = jest
      .spyOn(prisma.bookmarkBookmarkCollectionMap, 'deleteMany')
      .mockResolvedValue({ count: 0 });

    const bookmarkSpyOn = jest
      .spyOn(prisma.bookmark, 'deleteMany')
      .mockResolvedValue({ count: 0 });

    const bookmarkCollectionDeleteSpyOn = jest
      .spyOn(prisma.bookmarkCollection, 'delete')
      .mockResolvedValue(collection);

    // when
    const result = await service.removeBookmarkCollection(articleId, userId);

    // then

    expect(result).toBe(collection);

    expect(collectionFind).toHaveBeenCalledTimes(1);
    expect(deleteManySpyOn).toHaveBeenCalledTimes(1);
    expect(bookmarkSpyOn).toHaveBeenCalledTimes(1);
    expect(bookmarkCollectionDeleteSpyOn).toHaveBeenCalledTimes(1);
  });

  it('북마크 컬렉션 수정 - 존재하지 않는 북마크 컬렉션을 삭제하려고 할 때 "존재하지 않는 북마크 컬렉션이라는 메세지와 함께 에러를 던진다" ', async () => {
    // given
    const bookmarkCollectionFindUniqueSpyOn = jest
      .spyOn(prisma.bookmarkCollection, 'findUnique')
      .mockResolvedValue(null);

    const userId = collection.userId;
    const collectionId = collection.id;

    const bookmarkUpdateSpyOn = jest.spyOn(prisma.bookmark, 'update');

    const bookmarkCreateSpyOn = jest.spyOn(prisma.bookmark, 'create');

    const bookmarkBookmarkCollectionMapSpyOn = jest.spyOn(
      prisma.bookmarkBookmarkCollectionMap,
      'createMany',
    );
    const bookmarkCollectionUpdateSpyOn = jest.spyOn(
      prisma.bookmarkCollection,
      'update',
    );

    // when
    const result = async () => {
      await service.updateBookmarkCollection(
        userId,
        collectionId,
        updateBookmarkCollectionDto,
      );
    };

    // then

    await expect(result).rejects.toThrowError(
      new BadRequestException('존재하지 않는 북마크 컬렉션입니다.'),
    );
    expect(bookmarkCollectionFindUniqueSpyOn).toHaveBeenCalledTimes(1);
    expect(bookmarkUpdateSpyOn).toHaveBeenCalledTimes(0);
    expect(bookmarkCreateSpyOn).toHaveBeenCalledTimes(0);
    expect(bookmarkBookmarkCollectionMapSpyOn).toHaveBeenCalledTimes(0);
    expect(bookmarkCollectionUpdateSpyOn).toHaveBeenCalledTimes(0);
  });

  it('북마크 컬렉션 수정 - 존재하지 않는 북마크 컬렉션을 삭제하려고 할 때 "존재하지 않는 북마크 컬렉션이라는 메세지와 함께 에러를 던진다" ', async () => {
    // given
    const bookmarkCollectionFindUniqueSpyOn = jest
      .spyOn(prisma.bookmarkCollection, 'findUnique')
      .mockResolvedValue(collection);

    const userId = 100;
    const collectionId = collection.id;

    const bookmarkUpdateSpyOn = jest.spyOn(prisma.bookmark, 'update');

    const bookmarkCreateSpyOn = jest.spyOn(prisma.bookmark, 'create');

    const bookmarkBookmarkCollectionMapSpyOn = jest.spyOn(
      prisma.bookmarkBookmarkCollectionMap,
      'createMany',
    );
    const bookmarkCollectionUpdateSpyOn = jest.spyOn(
      prisma.bookmarkCollection,
      'update',
    );

    // when
    const result = async () => {
      await service.updateBookmarkCollection(
        userId,
        collectionId,
        updateBookmarkCollectionDto,
      );
    };

    // then

    await expect(result).rejects.toThrowError(
      new BadRequestException('북마크 컬렉션의 소유자만 수정할 수 있습니다.'),
    );
    expect(bookmarkCollectionFindUniqueSpyOn).toHaveBeenCalledTimes(1);
    expect(bookmarkUpdateSpyOn).toHaveBeenCalledTimes(0);
    expect(bookmarkCreateSpyOn).toHaveBeenCalledTimes(0);
    expect(bookmarkBookmarkCollectionMapSpyOn).toHaveBeenCalledTimes(0);
    expect(bookmarkCollectionUpdateSpyOn).toHaveBeenCalledTimes(0);
  });

  it('북마크 컬렉션 수정 - 존재하는 북마크 컬렉션을 소유자가 수정하고자 할 때는 정상적으로 수정이 된다.', async () => {
    // given
    const bookmarkCollectionFindUniqueSpyOn = jest
      .spyOn(prisma.bookmarkCollection, 'findUnique')
      .mockResolvedValue(collection);

    const userId = collection.userId;
    const collectionId = collection.id;

    const bookmarkUpdateSpyOn = jest
      .spyOn(prisma.bookmark, 'update')
      .mockResolvedValue(bookmark);

    const bookmarkCreateSpyOn = jest
      .spyOn(prisma.bookmark, 'create')
      .mockResolvedValue(bookmark);

    const bookmarkCollectionUpdateSpyOn = jest
      .spyOn(prisma.bookmarkCollection, 'update')
      .mockResolvedValue(collection);

    const bookmarkBookmarkCollectionMapSpyOn = jest
      .spyOn(prisma.bookmarkBookmarkCollectionMap, 'createMany')
      .mockResolvedValue({ count: 0 });

    // when

    await service.updateBookmarkCollection(
      userId,
      collectionId,
      updateBookmarkCollectionDto,
    );

    // then

    expect(bookmarkCollectionFindUniqueSpyOn).toHaveBeenCalledTimes(1);
    expect(bookmarkUpdateSpyOn).toHaveBeenCalledTimes(
      updateBookmarkCollectionDto.bookmarkIdsToDelete.length,
    );
    expect(bookmarkCreateSpyOn).toHaveBeenCalledTimes(
      updateBookmarkCollectionDto.locationsWithContent.length,
    );
    expect(bookmarkBookmarkCollectionMapSpyOn).toHaveBeenCalledTimes(1);
    expect(bookmarkCollectionUpdateSpyOn).toHaveBeenCalledTimes(1);
  });

  it('북마크 컬렉션 조회 테스트 X', async () => {
    // given
    const userId = 4;

    const bookmarkCollectionFindManySpyOn = jest
      .spyOn(prisma.bookmarkCollection, 'findMany')
      .mockResolvedValue([collection]);

    // when

    await service.fetchMyTotalBookmarkCollections(userId);

    // then

    expect(bookmarkCollectionFindManySpyOn).toHaveBeenCalledTimes(1);
  });

  it('북마크 컬렉션 조회 테스트 - 페이지네이션 O', async () => {
    // given
    const userId = 4;
    const dto = paginationDto;
    const bookmarkCollectionCountSpyOn = jest
      .spyOn(prisma.bookmarkCollection, 'count')
      .mockResolvedValue(1);

    const bookmarkCollectionFindManySpyOn = jest
      .spyOn(prisma.bookmarkCollection, 'findMany')
      .mockResolvedValue([collection]);

    // when

    await service.fetchMyBookmarkCollections(userId, dto);

    // then

    expect(bookmarkCollectionCountSpyOn).toHaveBeenCalledTimes(1);
    expect(bookmarkCollectionFindManySpyOn).toHaveBeenCalledTimes(1);
  });
});
