import * as process from 'node:process';

import { APP_ENV } from '@app/constant/app.enum';
import { NestExpressApplication } from '@nestjs/platform-express';
import {
  DocumentBuilder,
  SwaggerDocumentOptions,
  SwaggerModule,
} from '@nestjs/swagger';

import { RoutesAdminModule } from '../router/routes/routes.admin.module';
import { RoutesPublicModule } from '../router/routes/routes.public.module';

const APP_NAME = process.env.APP_NAME || 'NESTJS';
const swaggerLoader = async (app: NestExpressApplication) => {
  if (process.env.NODE_ENV !== APP_ENV.DEV) return;
  const configAdmin = new DocumentBuilder()
    .setTitle(APP_NAME)
    .setDescription(`${APP_NAME}'s Admin API description`)
    .setVersion('1.0')
    .addBearerAuth(
      { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
      'accessToken',
    )
    .addBearerAuth(
      { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
      'refreshToken',
    )
    .build();

  const optionAdmin: SwaggerDocumentOptions = {
    include: [RoutesAdminModule],
    deepScanRoutes: true,
  };

  const documentAdmin = SwaggerModule.createDocument(
    app,
    configAdmin,
    optionAdmin,
  );

  SwaggerModule.setup('docs/admin', app, documentAdmin);

  const configPublic = new DocumentBuilder()
    .setTitle(APP_NAME)
    .setDescription(`${APP_NAME}'s Public API description`)
    .setVersion('1.0')
    .addGlobalParameters({
      in: 'header',
      required: true,
      name: 'locale',
      schema: {
        example: 'vi',
      },
    })
    .build();

  const optionPublic: SwaggerDocumentOptions = {
    include: [RoutesPublicModule],
    deepScanRoutes: true,
  };

  const documentPublic = SwaggerModule.createDocument(
    app,
    configPublic,
    optionPublic,
  );

  SwaggerModule.setup('docs', app, documentPublic, {
    swaggerOptions: { persistAuthorization: true },
  });
};

export default swaggerLoader;
