import { checkDateRangeConstraint } from '@common/request/validations/request.date-range.validation';
import { IsDistinctArrayConstraint } from '@common/request/validations/request.distinct-array.validation';
import { IsEnumValueConstraint } from '@common/request/validations/request.enum-value.validation';
import { IsGreaterConstraint } from '@common/request/validations/request.greater-than.validation';
import { IsGreaterThanOrEqualToDayConstraint } from '@common/request/validations/request.greater-than-equal-to-day.validation';
import { IsValidPhoneConstraint } from '@common/request/validations/request.valid-phone.validation';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { RequestTimeoutInterceptor } from 'src/common/request/interceptors/request.timeout.interceptor';
import { RequestMiddlewareModule } from 'src/common/request/middleware/request.middleware.module';

import { IsGreaterDayConstraint } from './validations/request.greater-day.validation';

@Module({
  controllers: [],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: RequestTimeoutInterceptor,
    },
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
    //Custom validate
    IsDistinctArrayConstraint,
    IsValidPhoneConstraint,
    checkDateRangeConstraint,
    IsEnumValueConstraint,
    IsGreaterDayConstraint,
    IsGreaterThanOrEqualToDayConstraint,
    IsGreaterConstraint,
  ],
  imports: [
    RequestMiddlewareModule,
    ThrottlerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        throttlers: [
          {
            ttl: config.get('request.throttle.ttl'),
            limit: config.get('request.throttle.limit'),
          },
        ],
      }),
    }),
  ],
})
export class RequestModule {}
