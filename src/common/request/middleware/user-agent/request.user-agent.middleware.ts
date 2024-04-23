import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

@Injectable()
export class RequestUserAgentMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction): void {
    req.__userAgent = req.header('user-agent');
    next();
  }
}
