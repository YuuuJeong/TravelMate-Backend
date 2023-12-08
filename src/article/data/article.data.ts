import { Article, User } from '@prisma/client';
const userAMock: User = {
  id: 1,
  nickname: '가나다',
  provider: 'kakao',
  providerId: '23123123',
  level: 'USER',
  profileImageId: null,
  createdAt: new Date(),
  updatedAt: new Date(),
  bannedAt: null,
};
const userBMock: User = {
  id: 2,
  nickname: '가나다1',
  provider: 'kakao',
  providerId: '231231223',
  level: 'USER',
  profileImageId: null,
  createdAt: new Date(),
  updatedAt: new Date(),
  bannedAt: null,
};
const article: Article = {
  id: 1,
  title: '가나다',
  thumbnail: 'https://api-travelmate.site/attachments/41/?type=article',
  location: '서울',
  authorId: 1,
  springVersionID: 1,
  summerVersionID: null,
  fallVersionID: null,
  winterVersionID: null,
  deletedAt: null,
  createdAt: new Date(),
  updatedAt: new Date(),
};
export { userAMock, article, userBMock };
