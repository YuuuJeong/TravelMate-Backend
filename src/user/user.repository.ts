import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/schemas/user.schema';
import { UserEntity } from './entity/user.entity';

@Injectable()
export class UserRepository {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}

  async findUserByEmail(email: string): Promise<UserEntity | null> {
    return await this.userModel.findOne({ email });
  }

  async findUserByNickname(nickname: string): Promise<UserEntity | null> {
    return await this.userModel.findOne({ nickname });
  }

  async saveLocalUser(
    email: string,
    password: string,
    nickname: string,
  ): Promise<UserEntity> {
    return await this.userModel.create({
      email,
      password,
      nickname,
    });
  }
}
