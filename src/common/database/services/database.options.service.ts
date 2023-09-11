import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export default (configService: ConfigService): TypeOrmModuleOptions => {
  return {
    type: 'mysql',
    host: configService.get<string>('database.host'),
    port: configService.get<number>('database.port'),
    username: configService.get<string>('database.username'),
    password: configService.get<string>('database.password'),
    database: configService.get<string>('database.database'),
    autoLoadEntities: true,
    synchronize: configService.get<boolean>('database.synchronize'),
    charset: 'utf8mb4',
    bigNumberStrings: false,
    timezone: 'Z',
    logging: configService.get<boolean>('database.logging'),
  };
};
