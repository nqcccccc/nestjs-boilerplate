import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  RequestTimeoutException,
  HttpStatus,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Reflector } from '@nestjs/core';
import { Observable, throwError, TimeoutError } from 'rxjs';
import { catchError, timeout } from 'rxjs/operators';
import {
  REQUEST_CUSTOM_TIMEOUT_META_KEY,
  REQUEST_CUSTOM_TIMEOUT_VALUE_META_KEY,
} from 'src/common/request/constants/request.constant';

@Injectable()
export class RequestTimeoutInterceptor
  implements NestInterceptor<Promise<any>>
{
  private readonly maxTimeoutInMilliSecond: number;

  constructor(
    private readonly configService: ConfigService,
    private readonly reflector: Reflector,
  ) {
    this.maxTimeoutInMilliSecond =
      this.configService.get<number>('request.timeout');
  }

  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<Promise<any> | string>> {
    if (context.getType() === 'http') {
      const customTimeout = this.reflector.get<boolean>(
        REQUEST_CUSTOM_TIMEOUT_META_KEY,
        context.getHandler(),
      );

      if (customTimeout) {
        const milliSeconds: number = this.reflector.get<number>(
          REQUEST_CUSTOM_TIMEOUT_VALUE_META_KEY,
          context.getHandler(),
        );

        return next.handle().pipe(
          timeout(milliSeconds),
          catchError((err) => {
            if (err instanceof TimeoutError) {
              throw new RequestTimeoutException({
                statusCode: HttpStatus.REQUEST_TIMEOUT,
                errorCode: 'REQUEST_TIMEOUT',
                message: 'http.clientError.requestTimeOut',
              });
            }
            return throwError(() => err);
          }),
        );
      } else {
        return next.handle().pipe(
          timeout(this.maxTimeoutInMilliSecond),
          catchError((err) => {
            if (err instanceof TimeoutError) {
              throw new RequestTimeoutException({
                statusCode: HttpStatus.REQUEST_TIMEOUT,
                errorCode: 'REQUEST_TIMEOUT',
                message: 'http.clientError.requestTimeOut',
              });
            }
            return throwError(() => err);
          }),
        );
      }
    }

    return next.handle();
  }
}
