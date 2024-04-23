import {
  applyQueryPaging,
  applyQuerySorting,
  extractSorting,
} from '@common/database/helper/query.helper';
import { Injectable } from '@nestjs/common';
import { DataSource, Repository, SelectQueryBuilder } from 'typeorm';

import { FilterUserDto } from '../../dtos/filter-user.dto';
import { User } from '../entities/user.entity';

@Injectable()
export class UserRepository extends Repository<User> {
  constructor(dataSource: DataSource) {
    super(User, dataSource.createEntityManager());
  }

  async getUserByCredential(
    credential: string,
    column: string,
    withPassword = false,
  ): Promise<User> {
    const condition = {};
    condition[column] = credential;
    const query = this.createQueryBuilder('user')
      .leftJoinAndSelect('user.profile', 'profile')
      .leftJoinAndSelect('user.user_roles', 'ur')
      .leftJoinAndSelect('ur.role', 'r')
      .where(`user.${column} = :value`, { value: credential })
      .withDeleted();

    if (withPassword) {
      query.addSelect('user.password');
    }

    return query.getOne();
  }

  async getUserWithProfile(criteria: string, column: string): Promise<User> {
    const condition = {};
    condition[column] = criteria;
    return this.findOne({
      where: condition,
      relations: ['profile', 'user_roles', 'user_roles.role'],
    });
  }

  async getList(
    params: FilterUserDto,
    isExport = false,
  ): Promise<[User[], number]> {
    const query = this.createQueryBuilder('user')
      .leftJoinAndSelect('user.profile', 'profile')
      .leftJoinAndSelect('user.user_roles', 'user_roles')
      .innerJoinAndSelect(
        'user_roles.role',
        'role',
        'role.slug NOT IN(:...roleUser) ',
        { roleUser: ['user_standard'] },
      );

    this._applyQueryBase(params, query);

    applyQueryPaging(params, query, isExport);

    if (isExport) {
      query.select([
        'user',
        'profile.full_name',
        'profile.phone',
        'user_roles.id',
        'role.slug',
        'role.name',
      ]);

      return [await query.getRawMany(), 0];
    } else {
      return await query.getManyAndCount();
    }
  }

  private _applyQueryBase(
    params: FilterUserDto,
    query: SelectQueryBuilder<User>,
  ): void {
    const { filter, status, roles, sorting } = params;
    if (filter) {
      query.andWhere(
        '(user.email LIKE :filter OR user.username LIKE :filter OR profile.full_name LIKE :filter)',
        {
          filter: `%${filter}%`,
        },
      );
    }

    if (!isNaN(status)) {
      query.andWhere('user.status = :status', { status: +status });
    }

    if (roles?.length) {
      query.andWhere('role.slug IN(:...roles)', { roles });
    }
    if (sorting) {
      const sort = extractSorting(sorting);
      applyQuerySorting(
        sorting,
        query,
        sort.key?.includes('.') ? null : 'user',
      );
    }
  }
}
