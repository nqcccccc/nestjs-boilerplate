import { HttpException } from '@nestjs/common';

export default class CustomError extends HttpException {
  constructor(httpStatus?: number, errorCode?: string, message?: string) {
    super(
      {
        errorCode,
        message,
      },
      httpStatus,
    );
  }
}
