import { Inject, Injectable, NestMiddleware } from '@nestjs/common';
import * as morgan from 'morgan';
import { Request, Response, NextFunction } from 'express';
import { createStream } from 'rotating-file-stream';
import { ConfigService } from '@nestjs/config';
import * as dayjs from 'dayjs';
import { ILoggerHttpConfigOptions } from '@common/logger/interfaces/logger.interface';
import { LOGGER_HTTP_FORMAT } from '@common/logger/constants/logger.constant';
import { ILoggerHttpConfig } from '@common/logger/interfaces/logger.interface';
import { StreamOptions } from 'morgan';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';

@Injectable()
export class LoggerHttpMiddleware implements NestMiddleware {
  private readonly writeIntoFile: boolean;
  private readonly writeIntoConsole: boolean;

  constructor(
    private readonly configService: ConfigService,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {
    this.writeIntoFile = this.configService.get<boolean>(
      'logger.http.writeIntoFile',
    );
    this.writeIntoConsole = this.configService.get<boolean>(
      'logger.http.writeIntoConsole',
    );
  }

  private createStream(): StreamOptions {
    return {
      write: (message: string) => {
        if (this.writeIntoConsole) {
          this.logger.http(message, { context: 'HTTP' });
        }
      },
    };
  }

  async use(req: Request, res: Response, next: NextFunction): Promise<void> {
    if (this.writeIntoConsole || this.writeIntoFile) {
      const stream = this.createStream();
      morgan('combined', { stream })(req, res, next);
    } else {
      next();
    }
  }
}

@Injectable()
export class LoggerHttpWriteIntoFileMiddleware implements NestMiddleware {
  private readonly writeIntoFile: boolean;
  private readonly maxSize: string;
  private readonly maxFiles: number;

  constructor(private readonly configService: ConfigService) {
    this.writeIntoFile = this.configService.get<boolean>(
      'logger.http.writeIntoFile',
    );
    this.maxSize = this.configService.get<string>('logger.http.maxSize');
    this.maxFiles = this.configService.get<number>('logger.http.maxFiles');
  }

  private httpLogger(): ILoggerHttpConfig {
    const date: string = dayjs().format('YYYY-MM-DD');

    const loggerHttpOptions: ILoggerHttpConfigOptions = {
      stream: createStream(`${date}.log`, {
        path: `./logs/http/`,
        maxSize: this.maxSize,
        maxFiles: this.maxFiles,
        compress: true,
        interval: '1d',
      }),
    };

    return {
      loggerHttpFormat: LOGGER_HTTP_FORMAT,
      loggerHttpOptions,
    };
  }

  async use(req: Request, res: Response, next: NextFunction): Promise<void> {
    if (this.writeIntoFile) {
      const config: ILoggerHttpConfig = this.httpLogger();

      morgan(config.loggerHttpFormat, config.loggerHttpOptions)(req, res, next);
    } else {
      next();
    }
  }
}

@Injectable()
export class LoggerHttpWriteIntoConsoleMiddleware implements NestMiddleware {
  private readonly writeIntoConsole: boolean;

  constructor(private readonly configService: ConfigService) {
    this.writeIntoConsole = this.configService.get<boolean>(
      'logger.http.writeIntoConsole',
    );
  }

  private async httpLogger(): Promise<ILoggerHttpConfig> {
    return {
      loggerHttpFormat: LOGGER_HTTP_FORMAT,
    };
  }

  async use(req: Request, res: Response, next: NextFunction): Promise<void> {
    if (this.writeIntoConsole) {
      const config: ILoggerHttpConfig = await this.httpLogger();

      morgan(config.loggerHttpFormat)(req, res, next);
    } else {
      next();
    }
  }
}

@Injectable()
export class LoggerHttpResponseMiddleware implements NestMiddleware {
  private readonly writeIntoFile: boolean;
  private readonly writeIntoConsole: boolean;

  constructor(private readonly configService: ConfigService) {
    this.writeIntoConsole = this.configService.get<boolean>(
      'logger.http.writeIntoConsole',
    );
    this.writeIntoFile = this.configService.get<boolean>(
      'logger.http.writeIntoFile',
    );
  }
  use(req: Request, res: Response, next: NextFunction): void {
    if (this.writeIntoConsole || this.writeIntoFile) {
      const send: any = res.send;
      const resOld: any = res;

      // Add response data to request
      // this is for morgan
      resOld.send = (body: any) => {
        resOld.body = body;
        resOld.send = send;
        resOld.send(body);

        res = resOld as Response;
      };
    }

    next();
  }
}
