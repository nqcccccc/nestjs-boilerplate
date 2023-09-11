import { registerAs } from '@nestjs/config';
import * as process from 'process';

export default registerAs(
  'database',
  (): Record<string, any> => ({
    host: process.env.DATABASE_HOST,
    port: +process.env.DATABASE_PORT,
    username: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
    synchronize: process.env.DATABASE_SYNC === 'true' ?? false,
    logging: process.env.DATABASE_DEBUG === 'true' ?? false,
  }),
);
