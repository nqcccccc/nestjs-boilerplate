import 'winston-daily-rotate-file';

import { AppModule } from '@app/app.module';
import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';

import expressLoader from './loaders/express.loader';
import swaggerLoader from './loaders/swagger.loader';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    bufferLogs: true,
  });
  app.useLogger(app.get(WINSTON_MODULE_NEST_PROVIDER));

  const configService = app.get(ConfigService);

  await expressLoader(app, configService);

  const databaseUri: string =
    `${configService.get<string>('database.type')}://${configService.get<string>('database.host')}` +
    `/${configService.get<string>('database.database')}`;
  const port: number = configService.get<number>('app.http.port');

  const logger = new Logger();

  // enable
  const httpEnable: boolean = configService.get<boolean>('app.http.enable');
  const versionEnable: string = configService.get<string>(
    'app.versioning.enable',
  );
  const jobEnable: boolean = configService.get<boolean>('app.jobEnable');

  await swaggerLoader(app);

  await app.listen(port);

  logger.log(`==========================================================`);

  logger.log(`Job is ${jobEnable}`, 'NestApplication');
  logger.log(
    `Http is ${httpEnable}, ${
      httpEnable ? 'routes registered' : 'no routes registered'
    }`,
    'NestApplication',
  );
  logger.log(`Http versioning is ${versionEnable}`, 'NestApplication');

  logger.log(`Http Server running on ${await app.getUrl()}`, 'NestApplication');
  logger.log(`Database uri ${databaseUri}`, 'NestApplication');
  logger.log(
    `Cors whitelist ${configService.get<string | boolean | string[]>(
      'request.cors.allowOrigin',
    )}`,
    'NestApplication',
  );

  logger.log(`==========================================================`);
}

bootstrap().then();
