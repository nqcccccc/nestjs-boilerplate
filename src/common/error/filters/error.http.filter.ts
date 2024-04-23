import CustomError from '@common/error/exceptions/custom-error.exception';
import { NotifyService } from '@common/notify/services/notify.service';
import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { HttpArgumentsHost } from '@nestjs/common/interfaces';
import { Response } from 'express';
import { QueryFailedError } from 'typeorm';

@Catch()
export class ErrorHttpFilter implements ExceptionFilter {
  constructor(
    private readonly logger: Logger,
    private readonly notifyService: NotifyService,
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
      responseBody = {
        statusCode: statusCode,
        message: 'Internal server error',
      };
    } else if (exception instanceof Error) {
      responseBody = {
        statusCode: statusCode,
        message: 'Internal server error',
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
    let message = `🔥Internal server error. Message: ${exception.message}.`;
    let context = 'ERROR';

    if (
      exception instanceof HttpException ||
      exception instanceof CustomError
    ) {
      return;
    } else if (exception instanceof QueryFailedError) {
      message = `🔥 TypeORM query error. Message: ${exception.message}.`;
      context = 'QUERY_FAILED';
    }

    this.notifyService
      .sendSmS('error', {
        time: new Date().toISOString(),
        error: message,
      })
      .then();
    this.logger.error(message, exception.stack, context);
  }
}
