import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { firstValueFrom } from 'rxjs';
import { PrismaService } from 'src/prisma.service';
import { RedisService } from 'src/redis/redis.service';
import { SignUpDto } from './dtos/sign-up.dto';
import { NicknameAdj, NicknameNoun } from './constants/rand-nickname.constant';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly httpService: HttpService,
    private readonly redisService: RedisService,
    private readonly prisma: PrismaService,
  ) {}

  public async kakaoLogin(accessToken: string) {
    const kakaoProfile = await this.getKakaoProfile(accessToken);

    const user = await this.prisma.user.upsert({
      where: {
        providerId: kakaoProfile.id.toString(),
      },
      create: {
        provider: 'kakao',
        providerId: kakaoProfile.id.toString(),
        nickname: this.generateRandomNickname(),
      },
      update: {},
    });

    return this.signJwt(user.id);
  }

  private generateRandomNickname() {
    function getRandomInteger(max) {
      return Math.floor(Math.random() * max);
    }

    const adjective = NicknameAdj[getRandomInteger(NicknameAdj.length)];
    const noun = NicknameNoun[getRandomInteger(NicknameNoun.length)];

    return `${adjective} ${noun}`;
  }

  private async signJwt(payload: any) {
    const accessTokenJwt = this.jwtService.sign(payload);
    const refreshTokenJwt = this.jwtService.sign(payload, {
      expiresIn: '30d',
    });

    await this.redisService.set(
      `refreshToken:${payload.id}`,
      refreshTokenJwt,
      60 * 60 * 24 * 30,
    );

    return {
      accessToken: accessTokenJwt,
      refreshToken: refreshTokenJwt,
    };
  }

  private async getKakaoProfile(accessToken: string) {
    const kakaoApiUrl = 'https://kapi.kakao.com/v2/user/me';
    const headers = {
      'Content-Type': 'application/json; charset=utf-8',
      Authorization: `Bearer ${accessToken}`,
    };
    const { data } = await firstValueFrom(
      this.httpService.get(kakaoApiUrl, {
        headers: headers,
      }),
    );
    return data;
  }

  signUp(userId: number, dto: SignUpDto) {
    const { nickname, phoneNumber } = dto;
    return this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        nickname,
        phoneNumber,
      },
    });
  }
}
