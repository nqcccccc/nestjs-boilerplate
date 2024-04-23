import { Injectable, NestMiddleware } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NextFunction, Request, Response } from 'express';

@Injectable()
export class RequestVersionMiddleware implements NestMiddleware {
  private readonly versioningEnable: boolean;

  private readonly versioningGlobalPrefix: string;
  private readonly versioningPrefix: string;
  private readonly versioningVersion: string;

  private readonly repoVersion: string;

  constructor(private readonly configService: ConfigService) {
    this.versioningGlobalPrefix =
      this.configService.get<string>('app.globalPrefix');
    this.versioningEnable = this.configService.get<boolean>(
      'app.versioning.enable',
    );
    this.versioningPrefix = this.configService.get<string>(
      'app.versioning.prefix',
    );
    this.versioningVersion = this.configService.get<string>(
      'app.versioning.version',
    );
    this.repoVersion = this.configService.get<string>('app.repoVersion');
  }

  async use(req: Request, _res: Response, next: NextFunction): Promise<void> {
    const originalUrl: string = req.originalUrl;
    let version = this.versioningVersion;
    if (
      this.versioningEnable &&
      originalUrl.startsWith(
        `${this.versioningGlobalPrefix}/${this.versioningPrefix}`,
      )
    ) {
      const url: string[] = originalUrl.split('/');
      version = url[2].replace(this.versioningPrefix, '');
    }

    req.__version = version;
    req.__repoVersion = this.repoVersion;

    next();
  }
}
