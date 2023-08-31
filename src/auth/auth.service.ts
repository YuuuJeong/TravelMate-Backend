import { BadRequestException, Body, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserRepository } from 'src/user/user.repository';
import { hashPassword } from '../common/utils/hash-password.util';
import { LocalSignUpDto } from './dtos/req/local-sign-up.dto';
import { JwtPayload, Tokens } from './types/tokens.type';
import { ConfigService } from '@nestjs/config';
import { User } from 'src/schemas/user.schema';
import { LocalSignInDto } from './dtos/req/local-sign-in.dto';
import { UserDto } from 'src/user/dtos/res/user.dto';
import { UserEntity } from '../user/entity/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  private async issueTokens(payload: JwtPayload): Promise<Tokens> {
    const [access_token, refresh_token] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: this.configService.get<string>('JWT_SECRET'),
        expiresIn: `${this.configService.get('JWT_EXPIRES_IN')}`,
      }),
      this.jwtService.signAsync(payload, {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
        expiresIn: `${this.configService.get('JWT_REFRESH_EXPIRES_IN')}`,
      }),
    ]);

    return {
      access_token,
      refresh_token,
    };
  }

  /**
   * @desc local sign-up
   * @body LocalSignUpDto
   * @returns User
   * @author YuuuJeong
   */
  async localSignUp(@Body() body: LocalSignUpDto): Promise<UserEntity> {
    const { email, password, nickname } = body;

    const user: UserEntity | null =
      await this.userRepository.findUserByEmail(email);

    if (user) {
      throw new BadRequestException('이미 존재하는 이메일입니다.');
    }

    const userResult: UserEntity | null =
      await this.userRepository.findUserByNickname(nickname);

    if (userResult) {
      throw new BadRequestException('이미 존재하는 닉네임입니다.');
    }

    const hashedPassword: string = hashPassword(password);

    return await this.userRepository.saveLocalUser(
      email,
      hashedPassword,
      nickname,
    );
  }

  /**
   * @desc local sign-In
   * @body LocalSignInDto
   * @returns Tokens
   * @author YuuuJeong
   */
  async localSignIn(@Body() body: LocalSignInDto): Promise<Tokens> {
    const { email, password } = body;

    const user: UserEntity | null =
      await this.userRepository.findUserByEmail(email);

    if (!user) {
      throw new BadRequestException('가입되어 있지 않은 계정입니다.');
    }

    const hashedPassword: string = hashPassword(password);

    if (user.password !== hashedPassword) {
      throw new BadRequestException('비밀번호가 일치하지 않습니다');
    }

    return this.issueTokens({ id: user._id, nickname: user.nickname });
  }
}
