import { Injectable } from '@nestjs/common';
import { I18nContext, I18nService } from 'nestjs-i18n';

@Injectable()
export class MessageService {
  _context = '';

  constructor(private readonly i18n: I18nService, context: string) {
    this._context = context ?? 'APP';
  }

  getMessage(key: string, options?: Record<string, string | number>): string {
    return this.i18n.translate(`${this._context}.${key}`, {
      lang: I18nContext.current().lang,
      args: options,
    });
  }
}
