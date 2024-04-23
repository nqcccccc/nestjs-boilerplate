import 'dotenv/config';

import { registerAs } from '@nestjs/config';
import { join } from 'path';
import { DataSource, DataSourceOptions } from 'typeorm';

const options = {
  type: 'mysql',
  host: process.env.DATABASE_HOST,
  port: +process.env.DATABASE_PORT,
  username: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  synchronize: process.env.DATABASE_SYNC === 'true' ?? false,
  logging: process.env.DATABASE_DEBUG === 'true' ?? false,
  entities: [
    'dist/modules/**/*.entity{.ts,.js}',
    'dist/auth/**/*.entity{.ts,.js}',
  ],
  migrations: [join(__dirname, '../common/database/migrations/', '*.{ts,js}')],
  autoLoadEntities: true,
  timezone: 'Z',
  seeding: process.env.DATABASE_SEEDING === 'true' ?? false,
};

export default registerAs(
  'database',
  (): Record<string, any> => ({ ...options }),
);
export const connectionSource = new DataSource(options as DataSourceOptions);
