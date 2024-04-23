import { LoggerHttpMiddleware } from '@common/logger/middleware/http/logger.http.middleware';
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { WinstonLogger } from 'nest-winston';

@Module({
  providers: [WinstonLogger],
})
export class LoggerMiddlewareModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(LoggerHttpMiddleware).forRoutes('*');
  }
}
