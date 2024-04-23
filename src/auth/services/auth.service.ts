import { EStatus } from '@app/constant/app.enum';
import { AuthPasswordService } from '@auth/services/auth.password.service';
import {
  AuthBody,
  AuthPayLoad,
  AuthToken,
  AuthUser,
} from '@auth/types/auth.type';
import CustomError from '@common/error/exceptions/custom-error.exception';
import { MessageService } from '@common/message/services/message.service';
import { User } from '@modules/user/repository/entities/user.entity';
import { UserRepository } from '@modules/user/repository/repositories/user.repository';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import dayjs from 'dayjs';
import { I18nService } from 'nestjs-i18n';

import { EAuthType } from '../constants/auth.enum';
import { Token } from '../repository/entities/token.entity';
import { TokenRepository } from '../repository/repositories/token.repository';

@Injectable()
export class AuthService {
  private readonly authMessage: MessageService;

  constructor(
    private readonly configService: ConfigService,
    private readonly userRepository: UserRepository,
    private readonly tokenRepository: TokenRepository,
    private readonly jwtService: JwtService,
    private readonly authPasswordService: AuthPasswordService,
    i18nService: I18nService,
  ) {
    this.authMessage = new MessageService(i18nService, 'auth');
  }

  async authentication(body: AuthBody): Promise<AuthUser> {
    this._validateAuthenticate(body);

    let user: User | undefined;
    const isChangePassword = false;

    switch (body.grant_type) {
      case 'password':
        user = await this.authPasswordService.passwordAuthenticate(
          body.username,
          body.password,
        );
        break;
    }

    const authUser: AuthUser = this._generateAuthUser(user, body);

    this._checkAdminAccess(authUser);
    authUser.is_change_password = isChangePassword;
    return authUser;
  }

  async verifyToken(
    userId: string,
    authToken: string,
    type: EAuthType,
  ): Promise<AuthUser> {
    const token = await this.tokenRepository.findOneBy({
      user_id: userId,
      [type === EAuthType.access ? 'access_token' : 'refresh_token']: authToken,
    });

    if (!token) {
      throw new CustomError(
        401,
        'UNAUTHORIZED',
        this.authMessage.getMessage('TOKEN_INVALID'),
      );
    }

    const user = await this.userRepository.getUserByCredential(userId, 'id');

    if (!user || user.deleted_at) {
      throw new CustomError(
        401,
        'UNAUTHORIZED',
        this.authMessage.getMessage('USER_NOT_FOUND'),
      );
    }

    if (user.status === EStatus.inactive) {
      throw new CustomError(
        401,
        'ACCOUNT_INACTIVE',
        this.authMessage.getMessage('ACCOUNT_INACTIVE'),
      );
    }

    return {
      id: user.id,
      full_name: user.profile?.full_name,
      username: user.username,
      email: user.email,
      roles: user.user_roles?.map((ur) => ur.role.slug),
      scope: token.scope,
    };
  }

  async token(user: AuthUser): Promise<AuthToken> {
    const { token: accessToken, expired: accessTokenExpiresAt } =
      this._generateToken(
        user,
        this.configService.get<string>('auth.jwt.accessSecret'),
        this.configService.get<number>('auth.jwt.accessLifeTime'),
      );

    const { token: refreshToken, expired: refreshTokenExpiresAt } =
      this._generateToken(
        user,
        this.configService.get<string>('auth.jwt.refreshSecret'),
        this.configService.get<number>('auth.jwt.refreshLifeTime'),
      );
    const token = new Token();

    Object.assign(token, {
      user_id: user.id,
      scope: user.scope,
      access_token: accessToken,
      access_token_expires_at: accessTokenExpiresAt,
      refresh_token: refreshToken,
      refresh_token_expires_at: refreshTokenExpiresAt,
    });

    await this.tokenRepository.save(token);

    return {
      accessToken,
      accessTokenExpiresAt,
      refreshToken,
      refreshTokenExpiresAt,
      user: {
        id: user.id,
        scope: user.scope,
        roles: user.roles,
        is_change_password: user.is_change_password,
      },
    };
  }

  async removeToken(token: string, type: EAuthType): Promise<void> {
    await this.tokenRepository.delete({
      [type === EAuthType.access ? 'access_token' : 'refresh_token']: token,
    });
  }

  private _generateAuthUser(user: User, body: AuthBody): AuthUser {
    return {
      id: user.id,
      full_name: user.profile?.full_name,
      username: user.username,
      email: user.email,
      roles: user.user_roles.map((ur) => ur.role.slug),
      scope: body.scope,
    };
  }

  private _checkAdminAccess(authUser: AuthUser): void {
    const isStandardUserWithAdminScope =
      authUser.roles.length === 1 &&
      authUser.roles[0] === 'user_standard' &&
      authUser.scope === 'admin';

    if (isStandardUserWithAdminScope) {
      throw new CustomError(
        403,
        'FORBIDDEN',
        this.authMessage.getMessage('FORBIDDEN'),
      );
    }
  }

  private _generateToken(
    user: AuthUser,
    secret: string,
    lifetime: number,
  ): { token: string; expired: Date } {
    const now = dayjs().unix();

    const payload: AuthPayLoad = {
      iat: now,
      uid: user.id,
      claims: {
        user_id: user.id,
        username: user.username,
        email: user.email,
      },
    };

    return {
      token: this.jwtService.sign(payload, {
        secret: secret,
        expiresIn: now + lifetime,
      }),
      expired: new Date((now + lifetime) * 1000),
    };
  }

  private _validateAuthenticate(body: AuthBody) {
    if (body.grant_type === 'password') {
      if (body.scope !== 'admin' || !body.password || !body.username) {
        throw new CustomError(
          401,
          'UNAUTHORIZED',
          this.authMessage.getMessage('INVALID_AUTH'),
        );
      }
    } else if (body.grant_type === 'zalo') {
      if (body.scope !== 'mini_app' || !body.access_token) {
        throw new CustomError(
          401,
          'UNAUTHORIZED',
          this.authMessage.getMessage('INVALID_AUTH'),
        );
      }
    } else {
      throw new CustomError(
        401,
        'UNAUTHORIZED',
        this.authMessage.getMessage('INVALID_GRANT_TYPE'),
      );
    }
  }
}
