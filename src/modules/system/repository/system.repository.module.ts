import { System } from '@modules/system/repository/entities/system.entity';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { SystemRepository } from './repositories/system.repository';

@Module({
  providers: [SystemRepository],
  exports: [SystemRepository],
  imports: [TypeOrmModule.forFeature([System])],
})
export class SystemRepositoryModule {}
