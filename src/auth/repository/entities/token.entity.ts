import { BaseEntity } from '@common/database/entities/base.entity';
import { Column, Entity, Index } from 'typeorm';

@Entity()
export class Token extends BaseEntity {
  @Index()
  @Column()
  user_id: string;

  @Column()
  scope: string;

  @Column('varchar', { length: 1000, nullable: false })
  access_token: string;

  @Column({
    type: 'datetime',
    nullable: false,
    default: () => 'CURRENT_TIMESTAMP',
  })
  access_token_expires_at: Date;

  @Column('varchar', { length: 1000, nullable: false })
  refresh_token: string;

  @Column({
    type: 'datetime',
    nullable: false,
    default: () => 'CURRENT_TIMESTAMP',
  })
  refresh_token_expires_at: Date;
}
