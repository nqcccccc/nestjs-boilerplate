import { registerAs } from '@nestjs/config';
import * as process from 'process';

export default registerAs(
  'cache',
  (): Record<string, any> => ({
    redisHost: process.env.REDIS_HOST,
    redisPort: process.env.REDIS_PORT,
    redisTTL: +process.env.REDIS_TTL,
    redisDatabase: process.env.REDIS_DATABASE,
    redisQueueDatabase: process.env.REDIS_QUEUE_DATABASE,
    redisUsername: process.env.REDIS_USERNAME,
    redisPassword: process.env.REDIS_PASSWORD,
    redisUrl: `${process.env.REDIS_HOST}:${process.env.REDIS_PORT}/${process.env.REDIS_DATABASE}`,
  }),
);
