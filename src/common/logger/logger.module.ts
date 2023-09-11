import { Global, Module } from '@nestjs/common';
import { WinstonModule } from 'nest-winston';
import { LoggerOptionService } from '@common/logger/services/logger.options.service';
import { ConfigService } from '@nestjs/config';
import { LoggerMiddlewareModule } from '@common/logger/middleware/logger.middleware.module';

@Global()
@Module({
  imports: [
    WinstonModule.forRootAsync({
      inject: [ConfigService],
      useFactory: LoggerOptionService,
    }),
    LoggerMiddlewareModule,
  ],
})
export class LoggerModule {}
