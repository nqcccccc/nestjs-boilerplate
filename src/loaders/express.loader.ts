import { AppModule } from '@app/app.module';
import CustomError from '@common/error/exceptions/custom-error.exception';
import { MessageService } from '@common/message/services/message.service';
import { capitalizeText } from '@common/utils/string.util';
import {
  HttpStatus,
  INestApplication,
  RequestMethod,
  ValidationPipe,
  VersioningType,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { useContainer, ValidationError } from 'class-validator';
import helmet from 'helmet';
import { I18nService } from 'nestjs-i18n';

export default async (app: INestApplication, configService: ConfigService) => {
  process.env.NODE_ENV = configService.get<string>('app.env');

  const i18nService: I18nService = app.get(I18nService);
  const validateMessage: MessageService = new MessageService(i18nService);

  // enable
  const versionEnable: string = configService.get<string>(
    'app.versioning.enable',
  );

  // Global
  app.setGlobalPrefix(configService.get<string>('app.globalPrefix'), {
    exclude: [
      {
        path: '/media/video/:key',
        method: RequestMethod.GET,
      },
      {
        path: '/media/upload/single/:type',
        method: RequestMethod.POST,
      },
      {
        path: '/media/upload/multiple/:type',
        method: RequestMethod.POST,
      },
    ],
  });
  useContainer(app.select(AppModule), { fallbackOnErrors: true });

  app.useGlobalPipes(
    new ValidationPipe({
      stopAtFirstError: true,
      whitelist: true,
      transform: true,
      exceptionFactory: (validationErrors: ValidationError[] = []) => {
        let error = validationErrors[0];

        while (error?.children?.length) {
          error = error.children[0];
        }

        return new CustomError(
          400,
          'BAD_REQUEST',
          capitalizeText(
            validateMessage.getMessage(
              'VALIDATE.' + Object.keys(error.constraints)[0].toUpperCase(),
              'validate',
              {
                field: validateMessage.getMessage(
                  'FIELD.' + error.property.toUpperCase(),
                ),
                value: Object.values(error.constraints)[0],
              },
            ),
          ),
        );
      },
    }),
  );

  // Versioning
  if (versionEnable) {
    app.enableVersioning({
      type: VersioningType.URI,
      defaultVersion: configService.get<string>('app.versioning.version'),
      prefix: configService.get<string>('app.versioning.prefix'),
    });
  }

  // Cors
  app.enableCors({
    origin: configService.get<string | boolean | string[]>(
      'request.cors.allowOrigin',
    ),
    methods: configService.get<string[]>('request.cors.allowMethod'),
    preflightContinue: false,
    credentials: true,
    optionsSuccessStatus: HttpStatus.NO_CONTENT,
  });

  //Helmet
  app.use(
    helmet({
      crossOriginResourcePolicy: false,
    }),
  );
};
