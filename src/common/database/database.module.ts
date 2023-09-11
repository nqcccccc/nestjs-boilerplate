import { Module } from '@nestjs/common';
import DatabaseOptionsService from '@common/database/services/database.options.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: DatabaseOptionsService,
    }),
  ],
})
export class DatabaseModule {}
