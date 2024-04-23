import { BaseEntity } from '@common/database/entities/base.entity';
import { Role } from '@modules/role/repository/entities/role.entity';
import { ApiProperty } from '@nestjs/swagger';
import { Entity, JoinColumn, ManyToOne } from 'typeorm';

import { Permission } from './permission.entity';

@Entity()
export class PermissionRole extends BaseEntity {
  @ManyToOne(() => Role, (role) => role.role_permissions, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    orphanedRowAction: 'delete',
  })
  @JoinColumn({ name: 'role_id' })
  @ApiProperty({ type: () => Role })
  role: Role;

  @ManyToOne(() => Permission, (permission) => permission.permission_roles, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    orphanedRowAction: 'delete',
  })
  @JoinColumn({ name: 'permission_id' })
  @ApiProperty({ type: () => Permission })
  permission: Permission;
}
