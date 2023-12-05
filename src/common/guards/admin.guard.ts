import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { UserLevel } from '@prisma/client';
import { Observable } from 'rxjs';

@Injectable()
export class AdminGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    if (request?.user.level === UserLevel.ADMIN) {
      return true;
    }

    throw new HttpException('관리자 계정이 아닙니다.', HttpStatus.UNAUTHORIZED);
  }
}
