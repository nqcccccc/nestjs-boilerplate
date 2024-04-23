import { EStatus } from '@app/constant/app.enum';
import { BaseUUIDEntity } from '@common/database/entities/base-uuid.entity';
import { UserRole } from '@modules/user/repository/entities/user-role.entity';
import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { Column, Entity, OneToMany, OneToOne } from 'typeorm';

import { Profile } from './profile.entity';

@Entity()
export class User extends BaseUUIDEntity {
  @Column({
    nullable: true,
  })
  @ApiProperty()
  email: string;

  @Column({
    unique: true,
  })
  @ApiProperty()
  username: string;

  @Exclude()
  @Column({ select: false })
  @ApiHideProperty()
  password: string;

  @Column('tinyint', { default: EStatus.active })
  @ApiProperty({ enum: EStatus })
  status: EStatus;

  @OneToOne(() => Profile, (profile) => profile.user, {
    cascade: true,
  })
  @ApiProperty({ type: () => Profile })
  profile: Profile;

  @OneToMany(() => UserRole, (ur) => ur.user, {
    cascade: true,
    nullable: true,
  })
  @ApiProperty({ type: () => UserRole, isArray: true })
  user_roles: UserRole[];
}
