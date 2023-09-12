import { Controller, Get, Headers, VERSION_NEUTRAL } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as dayjs from 'dayjs';
import { IAppTestResponse } from '@app/interfaces/IAppTestResponse';

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
  async hello(
    @Headers('user-agent') userAgent: any,
  ): Promise<IAppTestResponse> {
    return {
      _metadata: {
        customProperty: {
          messageProperties: {
            serviceName: this.serviceName,
          },
        },
      },
      data: {
        userAgent,
        date: dayjs(),
        format: dayjs().format('YYYY-MM-DD'),
        timestamp: dayjs().valueOf(),
      },
    };
  }
}
