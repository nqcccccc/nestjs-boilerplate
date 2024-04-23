import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Permission } from './entities/permission.entity';
import { PermissionRole } from './entities/permission-role.entity';
import { PermissionRepository } from './repositories/permission.repository';

@Module({
  providers: [PermissionRepository],
  exports: [PermissionRepository],
  imports: [TypeOrmModule.forFeature([Permission, PermissionRole])],
})
export class PermissionRepositoryModule {}
