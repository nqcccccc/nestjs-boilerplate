import { ConfigService } from '@nestjs/config';
import * as winston from 'winston';
import 'winston-daily-rotate-file';
import { utilities as nestWinstonModuleUtilities } from 'nest-winston';

export const LoggerOptionService = (configService: ConfigService) => {
  const writeIntoFile = configService.get<boolean>(
    'logger.system.writeIntoFile',
  );

  const writeIntoConsole = configService.get<boolean>(
    'logger.system.writeIntoConsole',
  );

  const maxSize = configService.get<string>('logger.system.maxSize');
  const maxFiles = configService.get<string>('logger.system.maxFiles');

  const transports = [];

  if (writeIntoFile) {
    transports.push(
      new winston.transports.DailyRotateFile({
        filename: `%DATE%.log`,
        dirname: `logs/error`,
        datePattern: 'YYYY-MM-DD',
        zippedArchive: true,
        maxSize: maxSize,
        maxFiles: maxFiles,
        level: 'error',
      }),
    );
    transports.push(
      new winston.transports.DailyRotateFile({
        filename: `%DATE%.log`,
        dirname: `logs/default`,
        datePattern: 'YYYY-MM-DD',
        zippedArchive: true,
        maxSize: maxSize,
        maxFiles: maxFiles,
        level: 'info',
      }),
    );
    transports.push(
      new winston.transports.DailyRotateFile({
        filename: `%DATE%.log`,
        dirname: `logs/debug`,
        datePattern: 'YYYY-MM-DD',
        zippedArchive: true,
        maxSize: maxSize,
        maxFiles: maxFiles,
        level: 'debug',
      }),
    );
    transports.push(
      new winston.transports.DailyRotateFile({
        filename: `%DATE%.log`,
        dirname: `logs/http`,
        datePattern: 'YYYY-MM-DD',
        zippedArchive: true,
        maxSize: maxSize,
        maxFiles: maxFiles,
        level: 'http',
      }),
    );
  }

  if (writeIntoConsole) {
    transports.push(new winston.transports.Console({ level: 'debug' }));
  }

  return {
    format: winston.format.combine(
      winston.format.timestamp({ format: 'YYYY-MM-DD HH-MM:ss Z' }),
      winston.format.errors({ stack: true }),
      winston.format.splat(),
      nestWinstonModuleUtilities.format.nestLike(configService.get('app.name')),
    ),
    transports: [...transports],
    exitOnError: false,
  };
};
