import { User, UserLevel } from '@prisma/client';
export class UserEntity implements User {
  id: number;
  nickname: string | null;
  provider: string;
  providerId: string;
  level: UserLevel;
  profileImageId: number | null;
  createdAt: Date;
  updatedAt: Date;
}
