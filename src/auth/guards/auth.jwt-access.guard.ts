import { AuthUser } from '@auth/types/auth.type';
import CustomError from '@common/error/exceptions/custom-error.exception';
import { HttpStatus, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class AuthJwtAccessGuard extends AuthGuard('jwt_access') {
  handleRequest<User = AuthUser>(
    err: Error | CustomError,
    user: User,
    info: Error,
  ): User {
    if (err instanceof CustomError) {
      throw err;
    } else if (!user) {
      throw new CustomError(
        HttpStatus.UNAUTHORIZED,
        'UNAUTHORIZED',
        err ? err.message : info.message,
      );
    }

    return user;
  }
}
