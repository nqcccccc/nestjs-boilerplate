import 'winston-daily-rotate-file';

import { ConfigService } from '@nestjs/config';
import { utilities as nestWinstonModuleUtilities } from 'nest-winston';
import * as winston from 'winston';

const infoAndWarnFilter = winston.format((info) => {
  return info.level === 'info' || info.level === 'warn' ? info : false;
});

const httpFilter = winston.format((info) => {
  return info.level === 'http' ? info : false;
});

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
        format: winston.format.combine(httpFilter()),
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
        format: winston.format.combine(infoAndWarnFilter()),
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
