import { BadRequestException, Body, Injectable } from '@nestjs/common';
import { UserLocalSignUpDto } from './dtos/req/user-local-sign-up.dto';
import { UserRepository } from './user.repository';
import { hashPassword } from '../common/utils/hash-password.util';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}
  async localSignUp(@Body() body: UserLocalSignUpDto) {
    const { email, password, nickname } = body;

    const user = await this.userRepository.findUserByEmail(email);
    if (user) {
      throw new BadRequestException('이미 존재하는 이메일입니다.');
    }

    const userResult = await this.userRepository.findUserByEmail(nickname);

    if (userResult) {
      throw new BadRequestException('이미 존재하는 닉네임입니다.');
    }

    const hashedPassword = hashPassword(password);

    return await this.userRepository.saveLocalUser(
      email,
      hashedPassword,
      nickname,
    );
  }
}
