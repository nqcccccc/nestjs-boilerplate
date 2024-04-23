import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';

import { Profile } from '../entities/profile.entity';

@Injectable()
export class ProfileRepository extends Repository<Profile> {
  constructor(dataSource: DataSource) {
    super(Profile, dataSource.createEntityManager());
  }
}
