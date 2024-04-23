import { UserRole } from '@modules/user/repository/entities/user-role.entity';
import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';

import { Permission } from '../entities/permission.entity';
import { PermissionRole } from '../entities/permission-role.entity';

@Injectable()
export class PermissionRepository extends Repository<Permission> {
  constructor(private dataSource: DataSource) {
    super(Permission, dataSource.createEntityManager());
  }

  async getAllSlugByUserId(userId: string): Promise<Permission[]> {
    const subQuery = this.dataSource
      .createQueryBuilder(UserRole, 'ur')
      .innerJoinAndMapOne(
        'ur.permission_role',
        PermissionRole,
        'pr',
        'ur.role_id = pr.role_id',
      )
      .where(`ur.user_id = '${userId}'`)
      .select('pr.permission_id');

    const query = this.createQueryBuilder('p').where(
      `p.id IN(${subQuery.getQuery()})`,
    );

    query.select(['p.slug']);

    return query.getMany();
  }

  async getPermissionByRole(roleId: number): Promise<Permission[]> {
    const result = await this.createQueryBuilder('permission')
      .leftJoin(
        PermissionRole,
        'pr',
        'pr.permission_id = permission.id AND pr.role_id =:roleId',
        {
          roleId,
        },
      )
      .addSelect(
        'CONVERT(IF(pr.role_id IS NOT NULL, 1, 0), UNSIGNED INTEGER)',
        'checked',
      )
      .getRawMany();

    for (const _r of result) {
      _r.checked = !!+_r.checked;
      for (const [key, val] of Object.entries(_r)) {
        const regex = /^permission_/;
        if (regex.test(key)) {
          _r[key.replace(regex, '')] = val;
          delete _r[key];
        }
      }
    }

    return result;
  }
}
