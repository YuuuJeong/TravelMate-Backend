import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { firstValueFrom } from 'rxjs';
import { PrismaService } from 'src/prisma.service';
import { RedisService } from 'src/redis/redis.service';
import { SignUpDto } from './dtos/sign-up.dto';

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

    const user = await this.prisma.user.create({
      data: {
        provider: 'kakao',
        providerId: kakaoProfile.id.toString(),
      },
    });

    const payload = user;

    const accessTokenJwt = this.jwtService.sign(payload);
    const refreshTokenJwt = this.jwtService.sign(payload, {
      expiresIn: '30d',
    });

    await this.redisService.set(
      `refreshToken:${user.id}`,
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
