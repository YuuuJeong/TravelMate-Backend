import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { User } from 'src/schemas/user.schema';
import { AuthService } from './auth.service';
import { LocalSignInDto } from './dtos/req/local-sign-in.dto';
import { LocalSignUpDto } from './dtos/req/local-sign-up.dto';
import { Tokens } from './types/tokens.type';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @ApiOperation({
    description: '회원가입 API',
  })
  @ApiBody({
    type: LocalSignUpDto,
  })
  @ApiResponse({
    status: 200,
    description: '회원가입 성공',
  })
  @HttpCode(200)
  @Post('signup/local')
  async localSignUp(@Body() body: LocalSignUpDto): Promise<User> {
    return await this.authService.localSignUp(body);
  }

  @ApiOperation({
    description: '로그인 API',
  })
  @ApiBody({
    type: LocalSignInDto,
  })
  @ApiResponse({
    status: 200,
    description: '로그인 성공',
  })
  @HttpCode(200)
  @Post('signin/local')
  async localSignin(@Body() body: LocalSignInDto): Promise<Tokens> {
    return await this.authService.localSignIn(body);
  }
}
