import { MessageService } from '@common/message/services/message.service';
import { Controller, Get, VERSION_NEUTRAL } from '@nestjs/common';
import {
  DiskHealthIndicator,
  HealthCheck,
  HealthCheckService,
  MemoryHealthIndicator,
  TypeOrmHealthIndicator,
} from '@nestjs/terminus';
import { I18nService } from 'nestjs-i18n';

@Controller({
  version: VERSION_NEUTRAL,
  path: '/health',
})
export class HealthPublicController {
  private messageService: MessageService;

  constructor(
    private readonly health: HealthCheckService,
    private readonly memoryHealthIndicator: MemoryHealthIndicator,
    private readonly diskHealthIndicator: DiskHealthIndicator,
    private readonly databaseIndicator: TypeOrmHealthIndicator,
    private readonly i18nService: I18nService,
  ) {
    this.messageService = new MessageService(i18nService, 'health');
  }

  @HealthCheck()
  @Get('/database')
  async checkDatabase(): Promise<{ data: any }> {
    const data = await this.health.check([
      () => this.databaseIndicator.pingCheck('typeorm'),
    ]);

    return {
      data,
    };
  }

  @HealthCheck()
  @Get('/memory-heap')
  async checkMemoryHeap(): Promise<{ data: any }> {
    const data = await this.health.check([
      () =>
        this.memoryHealthIndicator.checkHeap('memoryHeap', 300 * 1024 * 1024),
    ]);

    return {
      data,
    };
  }

  @HealthCheck()
  @Get('/memory-rss')
  async checkMemoryRss(): Promise<{ data: any }> {
    const data = await this.health.check([
      () => this.memoryHealthIndicator.checkRSS('memoryRss', 300 * 1024 * 1024),
    ]);

    return {
      data,
    };
  }

  @HealthCheck()
  @Get('/storage')
  async checkStorage(): Promise<{ data: any }> {
    const data = await this.health.check([
      () =>
        this.diskHealthIndicator.checkStorage('diskHealth', {
          thresholdPercent: 0.75,
          path: '/',
        }),
    ]);

    return {
      data,
    };
  }
}
