import { registerAs } from '@nestjs/config';
import * as process from 'process';

export default registerAs(
  'request',
  (): Record<string, any> => ({
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
    timeout: 30 * 1000, // 30s based on ms module
    userAgent: {
      os: ['Mobile', 'Mac OS', 'Windows', 'UNIX', 'Linux', 'iOS', 'Android'],
      browser: [
        'IE',
        'Safari',
        'Edge',
        'Opera',
        'Chrome',
        'Firefox',
        'Samsung Browser',
        'UCBrowser',
      ],
    },
    cors: {
      allowMethod: ['GET', 'DELETE', 'PUT', 'PATCH', 'POST'],
      allowOrigin: process.env.REQUEST_WHITE_LIST || '*',
      allowHeader: [
        'Accept',
        'Accept-Language',
        'Content-Language',
        'Content-Type',
        'Origin',
        'Authorization',
        'Access-Control-Request-Method',
        'Access-Control-Request-Headers',
        'Access-Control-Allow-Headers',
        'Access-Control-Allow-Origin',
        'Access-Control-Allow-Methods',
        'Access-Control-Allow-Credentials',
        'Access-Control-Expose-Headers',
        'Access-Control-Max-Age',
        'Referer',
        'Host',
        'X-Requested-With',
        'x-custom-lang',
        'x-timestamp',
        'x-api-key',
        'x-timezone',
        'x-request-id',
        'x-version',
        'x-repo-version',
        'X-Response-Time',
        'user-agent',
      ],
    },
    throttle: {
      ttl: 0.5,
      limit: 10,
    },
  }),
);
