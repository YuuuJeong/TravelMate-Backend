import { PickType } from '@nestjs/swagger';
import { LocalSignUpDto } from './local-sign-up.dto';

export class LocalSignInDto extends PickType(LocalSignUpDto, [
  'email',
  'password',
]) {}
