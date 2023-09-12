import { Global, Module } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import { ErrorHttpFilter } from './filters/error.http.filter';

@Global()
@Module({
  controllers: [],
  providers: [
    {
      provide: APP_FILTER,
      useClass: ErrorHttpFilter,
    },
  ],
  imports: [],
})
export class ErrorModule {}
