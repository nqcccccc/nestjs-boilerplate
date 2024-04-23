import { AuthPasswordService } from '@auth/services/auth.password.service';
import { PermissionRepositoryModule } from '@modules/permission/repository/permission.repository.module';
import { RoleRepositoryModule } from '@modules/role/repository/role.repository.module';
import { UserRepositoryModule } from '@modules/user/repository/user.repository.module';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

import { AuthController } from './controllers/auth.controller';
import { TokenRepositoryModule } from './repository/token.repository.module';
import { AuthService } from './services/auth.service';
import { AuthJwtAccessStrategy } from './strategies/auth.jwt-access.strategy';
import { AuthJwtRefreshStrategy } from './strategies/auth.jwt-refresh.strategy';
import { AuthLocalStrategy } from './strategies/auth.local.strategy';

@Module({
  imports: [
    ConfigModule,

    TokenRepositoryModule,
    UserRepositoryModule,
    RoleRepositoryModule,
    PermissionRepositoryModule,

    PassportModule,
    JwtModule.registerAsync({
      inject: [ConfigService],
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('auth.jwt.accessSecret'),
        signOptions: {
          expiresIn: configService.get<string>('auth.jwt.accessLifeTime'),
        },
      }),
    }),
  ],
  providers: [
    AuthService,
    AuthPasswordService,
    AuthLocalStrategy,
    AuthJwtAccessStrategy,
    AuthJwtRefreshStrategy,
  ],
  controllers: [AuthController],
})
export class AuthModule {}
