import { AuthBody, AuthUser } from '@auth/types/auth.type';
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { Strategy } from 'passport-custom';

import { AuthService } from '../services/auth.service';

@Injectable()
export class AuthLocalStrategy extends PassportStrategy(
  Strategy,
  'local-custom',
) {
  constructor(private authService: AuthService) {
    super();
  }

  async validate(req: Request): Promise<AuthUser> {
    return await this.authService.authentication(req.body as AuthBody);
  }
}
