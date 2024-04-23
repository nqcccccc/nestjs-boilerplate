import { Injectable, NestMiddleware } from '@nestjs/common';
import dayjs from 'dayjs';
import { NextFunction, Request, Response } from 'express';
@Injectable()
export class RequestTimestampMiddleware implements NestMiddleware {
  async use(req: Request, res: Response, next: NextFunction): Promise<void> {
    req.__xTimestamp = req.header('x-timestamp')
      ? +req.header('x-timestamp')
      : undefined;
    req.__timestamp = dayjs().format('YYYY-MM-DD');
    next();
  }
}
