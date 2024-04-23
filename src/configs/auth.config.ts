import { registerAs } from '@nestjs/config';
import * as process from 'process';

export default registerAs(
  'auth',
  (): Record<string, any> => ({
    jwt: {
      accessSecret: process.env.JWT_ACCESS_SECRET,
      accessLifeTime: +process.env.JWT_ACCESS_LIFE_TIME,
      refreshSecret: process.env.JWT_REFRESH_SECRET,
      refreshLifeTime: +process.env.JWT_REFRESH_LIFE_TIME,
    },
    defaultPassword: process.env.DEFAULT_PASS || 'Qw3rty!@#i23',
  }),
);
