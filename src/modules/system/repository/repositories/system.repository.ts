import {
  applyQueryPaging,
  applyQuerySorting,
} from '@common/database/helper/query.helper';
import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';

import { FilterSystemDto } from '../../dtos/filter-system.dto';
import { System } from '../entities/system.entity';

@Injectable()
export class SystemRepository extends Repository<System> {
  constructor(dataSource: DataSource) {
    super(System, dataSource.createEntityManager());
  }

  async getList(params: FilterSystemDto): Promise<[System[], number]> {
    const { filter, sorting, group, status, is_public } = params;

    const query = this.createQueryBuilder('system');
    if (params?.filter) {
      query.where('(system.name LIKE :filter OR system.key LIKE :filter)', {
        filter: `%${filter}%`,
      });
    }

    if (group) {
      query.andWhere('system.group =:group', { group });
    }

    if (!isNaN(status)) {
      query.andWhere('system.status = :status', { status });
    }
    if (!isNaN(is_public)) {
      query.andWhere('system.is_public = :is_public', { is_public });
    }

    applyQuerySorting(sorting, query, 'system');
    applyQueryPaging(params, query);

    return await query.getManyAndCount();
  }

  async getValueByKey(key: string): Promise<string> {
    const system = await this.findOneBy({ key });
    return system?.value[0];
  }
}
