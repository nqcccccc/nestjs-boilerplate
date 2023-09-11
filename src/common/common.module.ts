import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import configs from '@configs/index';
import { DatabaseModule } from '@common/database/database.module';
import { LoggerModule } from '@common/logger/logger.module';

@Module({
  controllers: [],
  providers: [],
  imports: [
    ConfigModule.forRoot({
      load: configs,
      isGlobal: true,
      cache: true,
      envFilePath: ['.env'],
      expandVariables: true,
    }), //todo: validate .env
    LoggerModule,
    DatabaseModule,
  ],
})
export class CommonModule {}