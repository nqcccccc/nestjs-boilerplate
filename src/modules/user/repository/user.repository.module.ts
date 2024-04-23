import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Profile } from './entities/profile.entity';
import { User } from './entities/user.entity';
import { UserRole } from './entities/user-role.entity';
import { ProfileRepository } from './repositories/profile.repository';
import { UserRepository } from './repositories/user.repository';

@Module({
  providers: [UserRepository, ProfileRepository],
  exports: [UserRepository, ProfileRepository],
  imports: [TypeOrmModule.forFeature([User, Profile, UserRole])],
})
export class UserRepositoryModule {}
