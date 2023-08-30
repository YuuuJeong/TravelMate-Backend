import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/schemas/user.schema';

@Injectable()
export class UserRepository {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}

  async findUserByEmail(email: string): Promise<User | null> {
    return await this.userModel.findOne({ email });
  }

  async saveLocalUser(
    email: string,
    password: string,
    nickname: string,
  ): Promise<User> {
    return await this.userModel.create({
      email,
      password,
      nickname,
    });
  }
}
