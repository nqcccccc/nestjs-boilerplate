import { registerAs } from '@nestjs/config';
import * as process from 'process';

export default registerAs('request', (): Record<string, any> => {
  const whitelist: boolean | (string | RegExp)[] =
    !process.env.REQUEST_WHITE_LIST || process.env.REQUEST_WHITE_LIST === '*'
      ? true
      : (process.env.REQUEST_WHITE_LIST.split(',') || []).map((x) => {
          x = x.trim();
          return x.endsWith('/') && x.startsWith('/')
            ? new RegExp(x.substring(1, x.length - 1))
            : x;
        });

  return {
    body: {
      json: {
        maxFileSize: 100 * 1000, // 100kb
      },
      raw: {
        maxFileSize: 5.5 * 1024 * 1000, // 5.5mb
      },
      text: {
        maxFileSize: 100 * 1000, // 100kb
      },
      urlencoded: {
        maxFileSize: 100 * 1000, // 100kb
      },
    },
    timestamp: {
      toleranceTimeInMs: 5 * 60 * 1000, // 5 mins
    },
    timeout: 30 * 1000, // 30s
    cors: {
      allowMethod: ['GET', 'DELETE', 'PUT', 'PATCH', 'POST'],
      allowOrigin: whitelist,
    },
    throttle: {
      ttl: 0.5,
      limit: 10,
    },
  };
});
