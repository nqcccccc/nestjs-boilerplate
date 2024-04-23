import { BaseEntity } from '@common/database/entities/base.entity';
import { PermissionRole } from '@modules/permission/repository/entities/permission-role.entity';
import { UserRole } from '@modules/user/repository/entities/user-role.entity';
import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, OneToMany } from 'typeorm';

@Entity()
export class Role extends BaseEntity {
  @Column()
  @ApiProperty()
  name: string;

  @Column({ unique: true })
  @ApiProperty()
  slug: string;

  @OneToMany(() => PermissionRole, (pr) => pr.role, {
    cascade: true,
  })
  @ApiProperty({ type: () => PermissionRole, isArray: true })
  role_permissions: PermissionRole[];

  @OneToMany(() => UserRole, (ur) => ur.role)
  @ApiProperty({ type: () => UserRole, isArray: true })
  role_users: UserRole[];
}
