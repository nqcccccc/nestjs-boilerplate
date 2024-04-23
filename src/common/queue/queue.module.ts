import { BullModule } from '@nestjs/bullmq';
import { Global, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Global()
@Module({
  imports: [
    BullModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        connection: {
          host: configService.get('cache.redisHost'),
          port: +configService.get('cache.redisPort'),
          username: configService.get('cache.redisUsername'),
          password: configService.get('cache.redisPassword'),
          db: configService.get('cache.redisQueueDatabase'),
        },
      }),
    }),
  ],
})
export class QueueConfigModule {}
