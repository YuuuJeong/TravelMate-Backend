import { Test, TestingModule } from '@nestjs/testing';
import { ArticleService } from './article.service';
import { Period, User } from '@prisma/client';
import { ELocation } from './dtos/create-article.dto';
import { PrismaService } from '../prisma.service';
import { BadRequestException } from '@nestjs/common';
import { adminMock, article, userAMock, userBMock } from './data/article.data';

describe('payment', () => {
  let articleService: ArticleService;
  let prisma: PrismaService;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [],
      providers: [ArticleService, PrismaService],
    }).compile();
    articleService = module.get<ArticleService>(ArticleService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  describe('ArticleService', () => {
    it('게시글 작성 시 작성된 게시글을 반환한다.', async () => {
      const user: User = {
        id: 1,
        nickname: 'asd',
        provider: 'kakao',
        providerId: '123123',
        profileImageId: 1,
        level: 'USER',
        createdAt: new Date(),
        updatedAt: new Date(),
        bannedAt: null,
      };

      const dto = {
        title: 'test',
        content: 'test',
        period: Period.FALL,
        location: ELocation.JEJU,
        thumbnail: 'test',
      };

      const createSpy = jest
        .spyOn(articleService as any, 'createArticle')
        .mockResolvedValue({
          id: 1,
          ...dto,
        });

      const result = await articleService.createArticle(user, dto);

      expect(result).toStrictEqual({ id: 1, ...dto });
      expect(createSpy).toHaveBeenCalledTimes(1);
    });

    it('게시글 수정 요청 시 수정요청을 반환한다.', async () => {
      const user: User = {
        id: 1,
        nickname: 'asd',
        provider: 'kakao',
        providerId: '123123',
        profileImageId: 1,
        level: 'USER',
        createdAt: new Date(),
        updatedAt: new Date(),
        bannedAt: null,
      };

      // const dto = {
      //   title: 'test',
      //   content: 'test',
      //   period: Period.FALL,
      //   location: ELocation.JEJU,
      //   thumbnail: 'test',
      // };

      const dto = {
        period: Period.FALL,
        content: 'test',
        comment: 'test',
        bookmarksToAdd: [1, 2, 3],
        bookmarksToRemove: [4, 5, 6],
      };

      const createSpy = jest
        .spyOn(articleService as any, 'requestArticle')
        .mockResolvedValue({
          id: 1,
          ...dto,
        });

      const result = await articleService.requestArticle(user.id, 1, dto);

      expect(result).toStrictEqual({ id: 1, ...dto });
      expect(createSpy).toHaveBeenCalledTimes(1);
    });

    it('게시글 수정 요청 수락 시 수락된 요청을 반환한다.', async () => {
      const user: User = {
        id: 1,
        nickname: 'asd',
        provider: 'kakao',
        providerId: '123123',
        profileImageId: 1,
        level: 'USER',
        createdAt: new Date(),
        updatedAt: new Date(),
        bannedAt: null,
      };

      const dto = {
        period: Period.FALL,
        content: 'test',
        comment: 'test',
        bookmarksToAdd: [1, 2, 3],
        bookmarksToRemove: [4, 5, 6],
      };
      const acceptedAt = new Date();
      const createSpy = jest
        .spyOn(articleService as any, 'acceptRequest')
        .mockResolvedValue({
          id: 1,
          acceptedAt,
          ...dto,
        });

      const result = await articleService.acceptRequest(user.id, 1, 1);

      expect(result).toStrictEqual({ id: 1, acceptedAt, ...dto });
      expect(createSpy).toHaveBeenCalledTimes(1);
    });

    it('글 작성자나 관리자가 아니면 삭제할 수 없습니다. ', async () => {
      // when
      jest
        .spyOn(prisma.article, 'findUniqueOrThrow')
        .mockResolvedValue(article);

      // then
      const result = async () => {
        await articleService.deleteArticle(userBMock, 1);
      };

      // given
      await expect(result).rejects.toThrowError(
        new BadRequestException('글을 삭제할 권한이 없습니다.'),
      );
    });

    it('글 관리자면 게시글을 삭제할 수 있습니다. ', async () => {
      // when
      const findUnique = jest
        .spyOn(prisma.article, 'findUniqueOrThrow')
        .mockResolvedValue(article);

      const update = jest
        .spyOn(prisma.article, 'update')
        .mockResolvedValue(article);

      // then
      const result = await articleService.deleteArticle(adminMock, 1);

      // given
      expect(result).toEqual(article);
      expect(update).toBeCalledTimes(1);
      expect(findUnique).toBeCalledTimes(1);
    });

    it('글 작성자면 게시글을 삭제할 수 있습니다. ', async () => {
      // when
      const findUnique = jest
        .spyOn(prisma.article, 'findUniqueOrThrow')
        .mockResolvedValue(article);

      const update = jest
        .spyOn(prisma.article, 'update')
        .mockResolvedValue(article);

      // then
      const result = await articleService.deleteArticle(userAMock, article.id);

      // given
      expect(result).toEqual(article);
      expect(update).toBeCalledTimes(1);
      expect(findUnique).toBeCalledTimes(1);
    });
  });
});
