import { Module } from '@nestjs/common';

import { PermissionRepositoryModule } from './repository/permission.repository.module';
import { PermissionService } from './services/permission.service';

@Module({
  imports: [PermissionRepositoryModule],
  exports: [PermissionService, PermissionRepositoryModule],
  providers: [PermissionService],
  controllers: [],
})
export class PermissionModule {}
