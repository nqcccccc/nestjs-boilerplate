import { registerAs } from '@nestjs/config';

export default registerAs(
  'logger',
  (): Record<string, any> => ({
    http: {
      writeIntoFile: process.env.LOGGER_HTTP_WRITE_INTO_FILE === 'true',
      writeIntoConsole: process.env.LOGGER_HTTP_WRITE_INTO_CONSOLE === 'true',
      maxFiles: 5,
      maxSize: '2M',
    },
    system: {
      writeIntoFile: process.env.LOGGER_SYSTEM_WRITE_INTO_FILE === 'true',
      writeIntoConsole: process.env.LOGGER_SYSTEM_WRITE_INTO_CONSOLE === 'true',
      maxFiles: '7d',
      maxSize: '2m',
    },
  }),
);
