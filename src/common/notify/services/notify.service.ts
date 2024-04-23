import {
  InternalErrorTemplate,
  NotifyOptions,
} from '@common/notify/types/notify.type';
import { isEmpty } from '@common/utils/object.util';
import { stringReplacer } from '@common/utils/string.util';
import { HttpService } from '@nestjs/axios';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Cache } from 'cache-manager';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class NotifyService {
  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
  ) {}

  async sendSmS(type: 'error', data: any): Promise<void> {
    const chatId = await this.cacheManager.get<string>('notify_id');
    if (!chatId) return;

    const options: NotifyOptions = {
      chat_id: chatId,
      text: '',
      parse_mode: 'html',
    };

    switch (type) {
      case 'error':
        options.text = stringReplacer(InternalErrorTemplate, data);
        break;
    }

    await lastValueFrom(
      this.httpService.get(
        this.configService.get('notify.endPoint') + this._getUrlParams(options),
      ),
    );
  }

  private _getUrlParams = (params: any): string => {
    const queryParams = [];

    for (const key in params) {
      if (Object.prototype.hasOwnProperty.call(params, key)) {
        const value = params[key];
        if (isEmpty(value)) continue;
        if (Array.isArray(value)) {
          value.forEach((val) => {
            queryParams.push(
              `${encodeURIComponent(key)}[]=${encodeURIComponent(val)}`,
            );
          });
        } else {
          queryParams.push(
            `${encodeURIComponent(key)}=${encodeURIComponent(value)}`,
          );
        }
      }
    }
    return `?${queryParams.join('&')}`;
  };
}
