import { AuthToken, AuthUser } from '@auth/types/auth.type';
import { AUser } from '@common/request/decorators/params/request.params.decorator';
import { Controller, Post, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { ExtractJwt } from 'passport-jwt';

import { EAuthType } from '../constants/auth.enum';
import { Auth, RefreshGuard } from '../decorators/auth.jwt.decorator';
import { AuthLocalGuard } from '../guards/auth.local.guard';
import { AuthService } from '../services/auth.service';

@Controller()
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(AuthLocalGuard)
  @Post('/token')
  async login(@AUser() user: AuthUser): Promise<AuthToken> {
    return this.authService.token(user);
  }

  @RefreshGuard()
  @Post('/refresh')
  async refresh(@AUser() user: AuthUser): Promise<AuthToken> {
    return this.authService.token(user);
  }

  @Auth()
  @Post('/revoke')
  async revoke(@Req() req: Request): Promise<void> {
    const token = ExtractJwt.fromAuthHeaderAsBearerToken()(req);
    return this.authService.removeToken(token, EAuthType.access);
  }
}
