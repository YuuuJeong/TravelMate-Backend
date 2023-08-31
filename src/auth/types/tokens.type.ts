import { Types } from 'mongoose';
export type Tokens = {
  access_token: string;
  refresh_token: string;
};

export type AccessToken = {
  access_token: string;
};

export type JwtPayload = {
  id: Types.ObjectId;
  nickname: string;
};
