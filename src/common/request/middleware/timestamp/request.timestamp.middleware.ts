import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import * as dayjs from 'dayjs';
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
