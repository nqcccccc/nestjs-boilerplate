import { HttpStatus, Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import * as cors from 'cors';
import { CorsOptions } from 'cors';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class RequestCorsMiddleware implements NestMiddleware {
  private readonly allowOrigin: string | boolean | string[];
  private readonly allowMethod: string[];
  private readonly allowHeader: string[];

  constructor(private readonly configService: ConfigService) {
    this.allowOrigin = this.configService.get<string | boolean | string[]>(
      'request.cors.allowOrigin',
    );
    this.allowMethod = this.configService.get<string[]>(
      'request.cors.allowMethod',
    );
    this.allowHeader = this.configService.get<string[]>(
      'request.cors.allowHeader',
    );
  }

  use(req: Request, res: Response, next: NextFunction): void {
    const allowOrigin = this.allowOrigin;

    const corsOptions: CorsOptions = {
      origin: allowOrigin,
      methods: this.allowMethod,
      allowedHeaders: this.allowHeader,
      preflightContinue: false,
      credentials: true,
      optionsSuccessStatus: HttpStatus.NO_CONTENT,
    };

    cors(corsOptions)(req, res, next);
  }
}
