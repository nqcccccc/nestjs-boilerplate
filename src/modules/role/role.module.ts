import { PermissionRepositoryModule } from '@modules/permission/repository/permission.repository.module';
import { Module } from '@nestjs/common';

import { RoleRepositoryModule } from './repository/role.repository.module';
import { RoleService } from './services/role.service';

@Module({
  imports: [RoleRepositoryModule, PermissionRepositoryModule],
  exports: [RoleService],
  providers: [RoleService],
  controllers: [],
})
export class RoleModule {}
