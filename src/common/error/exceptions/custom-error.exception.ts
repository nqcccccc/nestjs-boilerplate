import { HttpException } from '@nestjs/common';

export default class CustomError extends HttpException {
  constructor(
    httpStatus?: number,
    errorCode?: string,
    message?: string,
    data?: Record<string, string>,
  ) {
    super(
      {
        errorCode,
        message,
        data,
      },
      httpStatus,
    );
  }
}
