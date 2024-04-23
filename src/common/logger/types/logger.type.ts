import { RotatingFileStream } from 'rotating-file-stream';

export type LoggerHttpConfigOptions = {
  readonly stream: RotatingFileStream;
};

export type LoggerHttpConfig = {
  readonly loggerHttpFormat: string;
  readonly loggerHttpOptions?: LoggerHttpConfigOptions;
};
