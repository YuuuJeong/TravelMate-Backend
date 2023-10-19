import { Body, Controller, Post, UseGuards } from '@nestjs/common';
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

  @ApiOperation({
    summary: 'sign up',
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post('signup')
  signUp(@CurrentUser() currentUser: User, @Body() dto: SignUpDto) {
    return this.authService.signUp(currentUser.id, dto);
  }
}
