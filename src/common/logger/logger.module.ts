import { LoggerMiddlewareModule } from '@common/logger/middleware/logger.middleware.module';
import { LoggerOptionService } from '@common/logger/services/logger.options.service';
import { Global, Logger, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { WinstonModule } from 'nest-winston';

@Global()
@Module({
  imports: [
    WinstonModule.forRootAsync({
      inject: [ConfigService],
      useFactory: LoggerOptionService,
    }),
    LoggerMiddlewareModule,
  ],
  providers: [Logger],
  exports: [Logger],
})
export class LoggerModule {}
