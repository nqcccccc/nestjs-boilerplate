import { AuthUser } from '@auth/types/auth.type';
import CustomError from '@common/error/exceptions/custom-error.exception';
import { HttpStatus, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class AuthJwtRefreshGuard extends AuthGuard('jwt_refresh') {
  handleRequest<IUser = AuthUser>(err: Error, user: IUser, info: Error): IUser {
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
