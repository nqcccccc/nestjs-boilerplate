import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Role } from './entities/role.entity';
import { RoleRepository } from './repositories/role.repository';

@Module({
  providers: [RoleRepository],
  exports: [RoleRepository],
  imports: [TypeOrmModule.forFeature([Role])],
})
export class RoleRepositoryModule {}
