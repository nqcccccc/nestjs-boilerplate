import { BaseEntity } from '@common/database/entities/base.entity';
import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, OneToMany } from 'typeorm';

import { PermissionRole } from './permission-role.entity';

@Entity()
export class Permission extends BaseEntity {
  @Column()
  @ApiProperty()
  name: string;

  @Column({ unique: true })
  @ApiProperty()
  slug: string;

  @Column()
  @ApiProperty()
  module: string;

  @Column()
  @ApiProperty()
  position: number;

  @OneToMany(() => PermissionRole, (pr) => pr.permission, { cascade: true })
  @ApiProperty({ type: () => PermissionRole })
  permission_roles: PermissionRole[];
}
