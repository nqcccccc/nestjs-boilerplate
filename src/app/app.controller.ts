import { Controller, Get, Req, VERSION_NEUTRAL } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as dayjs from 'dayjs';
import { IAppTestResponse } from '@app/interfaces/IAppTestResponse';
import { Request } from 'express';

@Controller({
  version: VERSION_NEUTRAL,
  path: '/',
})
export class AppController {
  private readonly serviceName: string;

  constructor(private readonly configService: ConfigService) {
    this.serviceName = this.configService.get<string>('app.name');
  }

  @Get('/hello')
  async hello(@Req() req: Request): Promise<IAppTestResponse> {
    return {
      _metadata: {
        customProperty: {
          messageProperties: {
            serviceName: this.serviceName,
          },
        },
      },
      data: {
        userAgent: req.__userAgent,
        date: dayjs(),
        format: dayjs().format('YYYY-MM-DD'),
        timestamp: dayjs().valueOf(),
      },
    };
  }

  async delayMs(ms: number): Promise<void> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve();
      }, ms);
    });
  }
}
