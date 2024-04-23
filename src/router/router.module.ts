import { AuthModule } from '@auth/auth.module';
import { DynamicModule, ForwardReference, Module, Type } from '@nestjs/common';
import { RouterModule as NestJsRouterModule } from '@nestjs/core';

import { RoutesAdminModule } from './routes/routes.admin.module';
import { RoutesPublicModule } from './routes/routes.public.module';

@Module({})
export class RouterModule {
  static forRoot(): DynamicModule {
    const imports: (
      | DynamicModule
      | Type
      | Promise<DynamicModule>
      | ForwardReference
    )[] = [];

    if (process.env.HTTP_ENABLE === 'true') {
      imports.push(
        RoutesPublicModule,
        RoutesAdminModule,
        AuthModule,
        NestJsRouterModule.register([
          {
            path: '',
            module: RoutesPublicModule,
          },
          {
            path: '/admin',
            module: RoutesAdminModule,
          },
          {
            path: '/auth',
            module: AuthModule,
          },
        ]),
      );
    }

    return {
      module: RouterModule,
      providers: [],
      exports: [],
      controllers: [],
      imports,
    };
  }
}
