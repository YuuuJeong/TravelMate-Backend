import { BadRequestException } from '@nestjs/common';
import { ArticleService } from './article.service';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../prisma.service';
import { article, userBMock } from './data/article.data';

describe('ArticleService', () => {
  let service: ArticleService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ArticleService, PrismaService],
    }).compile();

    service = module.get<ArticleService>(ArticleService);
    //Get a reference to the module's `PrismaService` and save it for usage in our tests.
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('article should delete when article exists and authorId is properly given ', async () => {
    // when
    jest.spyOn(prisma.article, 'findUniqueOrThrow').mockResolvedValue(article);

    // then
    const result = async () => {
      await service.deleteArticle(userBMock, 1);
    };

    // given
    await expect(result).rejects.toThrowError(
      new BadRequestException('글을 삭제할 권한이 없습니다.'),
    );
  });
});
