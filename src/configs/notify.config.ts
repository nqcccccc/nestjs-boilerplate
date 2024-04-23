import { registerAs } from '@nestjs/config';
import * as process from 'process';

export default registerAs(
  'notify',
  (): Record<string, any> => ({
    endPoint: `${process.env.NOTIFY_ENDPOINT}/${process.env.NOTIFY_KEY}/${process.env.NOTIFY_URL}`,
  }),
);
