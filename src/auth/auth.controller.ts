import { Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({})
  @Post('kakao')
  @ApiBody({
    schema: {
      example: {
        accessToken: 'string',
      },
    },
  })
  kakaoLogin(accessToken: string) {
    return this.authService.kakaoLogin(accessToken);
  }
}
