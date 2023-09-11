import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { LoggerHttpMiddleware } from '@common/logger/middleware/http/logger.http.middleware';
import { WinstonLogger } from 'nest-winston';

@Module({
  providers: [WinstonLogger],
})
export class LoggerMiddlewareModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(LoggerHttpMiddleware).forRoutes('*');
  }
}
