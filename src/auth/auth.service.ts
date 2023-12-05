import { HttpService } from '@nestjs/axios';
import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { firstValueFrom } from 'rxjs';
import { PrismaService } from 'src/prisma.service';
import { RedisService } from 'src/redis/redis.service';
import { SignUpDto } from './dtos/sign-up.dto';
import { NicknameAdj, NicknameNoun } from './constants/rand-nickname.constant';
import { ConfigService } from '@nestjs/config';
import { User } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly httpService: HttpService,
    private readonly redisService: RedisService,
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
  ) {}

  private async notifyBanLog(user: User) {
    if (user.bannedAt) {
      const userBanLog = await this.prisma.userBanLog.findUnique({
        where: {
          userId: user.id,
        },
      });

      throw new BadRequestException(
        `${userBanLog?.reason ?? '정지된 회원입니다'}`,
      );
    }
  }
  public async kakaoLogin(accessToken: string) {
    const kakaoProfile = await this.getKakaoProfile(accessToken);

    const user = await this.prisma.user.upsert({
      where: {
        providerId: kakaoProfile.id.toString(),
      },
      create: {
        provider: 'kakao',
        providerId: kakaoProfile.id.toString(),
        nickname: await this.generateRandomNickname(),
      },
      update: {},
    });

    await this.notifyBanLog(user);

    return this.signJwt(user);
  }

  public async googleLogin(accessToken: string) {
    const googleProfile = await this.getGoogleProfile(accessToken);

    const user = await this.prisma.user.upsert({
      where: {
        providerId: googleProfile.id.toString(),
      },
      create: {
        provider: 'google',
        providerId: googleProfile.id.toString(),
        nickname: await this.generateRandomNickname(),
      },
      update: {},
    });

    await this.notifyBanLog(user);

    return this.signJwt(user);
  }

  public async refreshJWT(refreshToken: string) {
    const payload = this.jwtService.verify(refreshToken);
    const redisRefreshToken = await this.redisService.get(
      `refreshToken:${payload.id}`,
    );

    if (redisRefreshToken !== refreshToken) {
      throw new UnauthorizedException('invalid refresh token');
    }

    const user = await this.prisma.user.findUniqueOrThrow({
      where: {
        id: payload.id,
      },
    });

    await this.notifyBanLog(user);

    return this.signJwt(user);
  }

  private async generateRandomNickname() {
    function getRandomInteger(max) {
      return Math.floor(Math.random() * max);
    }

    let adjective = NicknameAdj[getRandomInteger(NicknameAdj.length)];
    let noun = NicknameNoun[getRandomInteger(NicknameNoun.length)];

    while (true) {
      const user = await this.prisma.user.findUnique({
        where: {
          nickname: `${adjective} ${noun}`,
        },
      });

      if (!user) {
        break;
      }
      adjective = NicknameAdj[getRandomInteger(NicknameAdj.length)];
      noun = NicknameNoun[getRandomInteger(NicknameNoun.length)];
    }

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
        headers,
      }),
    );
    return data;
  }

  private async getGoogleProfile(accessToken: string) {
    const googleApiURL = 'https://www.googleapis.com/oauth2/v2/userinfo';
    const headers = {
      Authorization: `Bearer ${accessToken}`,
    };

    const { data } = await firstValueFrom(
      this.httpService.get(googleApiURL, {
        headers,
      }),
    );

    return data;
  }

  signUp(userId: number, dto: SignUpDto) {
    const { nickname } = dto;
    return this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        nickname,
      },
    });
  }
}
