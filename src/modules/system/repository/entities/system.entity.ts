import { EStatus, ESystemType } from '@app/constant/app.enum';
import { BaseEntity } from '@common/database/entities/base.entity';
import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity } from 'typeorm';

@Entity()
export class System extends BaseEntity {
  @Column()
  @ApiProperty()
  name: string;

  @Column()
  @ApiProperty()
  key: string;

  @Column({
    type: 'text',
    transformer: {
      to(value: any): any {
        if (Object.prototype.toString.call(value) === '[object Array]') {
          return JSON.stringify(value);
        }

        return value;
      },
      from(value: any): any {
        try {
          return JSON.parse(value);
        } catch (e) {
          return value ? [value] : [];
        }
      },
    },
  })
  @ApiProperty({
    type: String,
    description: 'Serialized as JSON if it is an array, otherwise stores as is',
  })
  value: string;

  @Column({ type: 'tinyint', default: ESystemType.text })
  @ApiProperty()
  unit: ESystemType;

  @Column()
  @ApiProperty()
  group: string;

  @Column({ type: 'tinyint', default: EStatus.active })
  @ApiProperty({ enum: EStatus })
  status: EStatus;

  @Column({ type: 'tinyint', default: EStatus.active })
  @ApiProperty({ enum: EStatus })
  is_public: EStatus;
}
