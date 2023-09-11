import { RotatingFileStream } from 'rotating-file-stream';
import { Response } from 'express';

export interface ILog {
  description: string;
  class?: string;
  function?: string;
  path?: string;
}

export interface ILoggerHttpConfigOptions {
  readonly stream: RotatingFileStream;
}

export interface ILoggerHttpConfig {
  readonly loggerHttpFormat: string;
  readonly loggerHttpOptions?: ILoggerHttpConfigOptions;
}

export interface ILoggerHttpMiddleware extends Response {
  body: string;
}
