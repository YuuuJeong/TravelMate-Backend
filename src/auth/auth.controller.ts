import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { SignUpDto } from './dtos/sign-up.dto';
import { JwtAuthGuard } from './strategies/jwt.strategy';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { User } from '@prisma/client';

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
  kakaoLogin(@Body('accessToken') accessToken: string) {
    return this.authService.kakaoLogin(accessToken);
  }

  @ApiOperation({})
  @Post('google')
  @ApiBody({
    schema: {
      example: {
        accessToken: 'string',
      },
    },
  })
  googleLogin(@Body('accessToken') accessToken: string) {
    return this.authService.googleLogin(accessToken);
  }

  @ApiOperation({})
  @ApiBody({
    schema: {
      example: {
        refreshToken: 'string',
      },
    },
  })
  @Post('refresh')
  refreshJWT(@Body('refreshToken') refreshToken: string) {
    return this.authService.refreshJWT(refreshToken);
  }

  @ApiOperation({
    summary: 'sign up',
    deprecated: true,
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post('signup')
  signUp(@CurrentUser() currentUser: User, @Body() dto: SignUpDto) {
    return this.authService.signUp(currentUser.id, dto);
  }
}
