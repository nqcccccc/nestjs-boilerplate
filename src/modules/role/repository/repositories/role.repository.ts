import {
  applyQueryPaging,
  applyQuerySorting,
} from '@common/database/helper/query.helper';
import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';

import { FilterRoleDto } from '../../dtos/filter-role.dto';
import { Role } from '../entities/role.entity';

@Injectable()
export class RoleRepository extends Repository<Role> {
  constructor(dataSource: DataSource) {
    super(Role, dataSource.createEntityManager());
  }

  async getList(params: FilterRoleDto): Promise<[Role[], number]> {
    const query = this.createQueryBuilder('role');
    if (params?.filter) {
      query.where('(role.name LIKE :filter OR role.slug LIKE :filter)', {
        filter: `%${params?.filter}%`,
      });
    }

    applyQuerySorting(params.sorting, query, 'role');
    applyQueryPaging(params, query);

    return await query.getManyAndCount();
  }
}
