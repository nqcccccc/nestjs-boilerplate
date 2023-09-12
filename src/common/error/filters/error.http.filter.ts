import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Inject,
} from '@nestjs/common';
import { HttpArgumentsHost } from '@nestjs/common/interfaces';
import { Response } from 'express';
import { QueryFailedError } from 'typeorm';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import CustomError from '@common/error/exceptions/custom-error.exception';

@Catch()
export class ErrorHttpFilter implements ExceptionFilter {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {}

  private static handleResponse(
    response: Response,
    exception: CustomError | HttpException | QueryFailedError | Error,
  ): void {
    let responseBody: any = { message: 'Internal server error' };
    let statusCode = HttpStatus.INTERNAL_SERVER_ERROR;

    if (
      exception instanceof CustomError ||
      exception instanceof HttpException
    ) {
      statusCode = exception.getStatus();
      responseBody = {
        statusCode: statusCode,
        ...JSON.parse(JSON.stringify(exception.getResponse())),
      };
    } else if (exception instanceof QueryFailedError) {
      statusCode = HttpStatus.BAD_REQUEST;
      responseBody = {
        statusCode: statusCode,
        message: exception.message,
      };
    } else if (exception instanceof Error) {
      responseBody = {
        statusCode: statusCode,
        message: exception.stack,
      };
    }

    response.status(statusCode).json(responseBody);
  }

  catch(exception: HttpException | Error, host: ArgumentsHost): void {
    const ctx: HttpArgumentsHost = host.switchToHttp();
    const response: Response = ctx.getResponse();

    // Handling error message and logging
    this.handleMessage(exception);

    // Response to client
    ErrorHttpFilter.handleResponse(response, exception);
  }

  private handleMessage(
    exception: CustomError | HttpException | QueryFailedError | Error,
  ): void {
    let message = `🔥Internal server error. Message: ${exception}. \n Stack: ${exception.stack.toString()}`;
    let context = 'ERROR';

    if (
      exception instanceof HttpException ||
      exception instanceof CustomError
    ) {
      return;
    } else if (exception instanceof QueryFailedError) {
      message = exception.stack.toString();
      context = 'QUERY_FAILED';
    }

    this.logger.error(message, context);
  }
}
