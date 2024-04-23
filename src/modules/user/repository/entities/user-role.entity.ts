import { BaseEntity } from '@common/database/entities/base.entity';
import { Role } from '@modules/role/repository/entities/role.entity';
import { ApiProperty } from '@nestjs/swagger';
import { Entity, JoinColumn, ManyToOne } from 'typeorm';

import { User } from './user.entity';

@Entity()
export class UserRole extends BaseEntity {
  @ManyToOne(() => User, (user) => user.user_roles, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    orphanedRowAction: 'delete',
  })
  @JoinColumn({ name: 'user_id' })
  @ApiProperty({ type: () => User })
  user: User;

  @ManyToOne(() => Role, (role) => role.role_users)
  @JoinColumn({ name: 'role_id' })
  @ApiProperty({ type: () => Role })
  role: Role;
}
