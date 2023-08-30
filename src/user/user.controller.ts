import { Body, Controller, Post } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { User } from 'src/schemas/user.schema';
import { UserLocalSignUpDto } from './dtos/req/user-local-sign-up.dto';
import { UserService } from './user.service';

@Controller('users')
@ApiTags('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiOperation({
    description: '회원가입 API',
  })
  @ApiBody({
    type: UserLocalSignUpDto,
  })
  @ApiResponse({
    status: 200,
    description: '회원가입 성공',
  })
  @Post('signup/local')
  async localSignUp(@Body() body: UserLocalSignUpDto): Promise<User> {
    return await this.userService.localSignUp(body);
  }
}
