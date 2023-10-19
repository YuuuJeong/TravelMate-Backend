import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly httpService: HttpService,
  ) {}

  public async kakaoLogin(accessToken: string) {
    const kakaoProfile = await this.getKakaoProfile(accessToken);
    return kakaoProfile;
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
}
