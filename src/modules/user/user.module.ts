import { TokenRepositoryModule } from '@auth/repository/token.repository.module';
import { RoleRepositoryModule } from '@modules/role/repository/role.repository.module';
import { UserRepositoryModule } from '@modules/user/repository/user.repository.module';
import { Module } from '@nestjs/common';

import { UserService } from './services/user.service';

@Module({
  imports: [RoleRepositoryModule, UserRepositoryModule, TokenRepositoryModule],
  exports: [UserService],
  providers: [UserService],
  controllers: [],
})
export class UserModule {}
