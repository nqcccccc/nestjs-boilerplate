import { ApiProperty, getSchemaPath } from '@nestjs/swagger';

import { Permission } from '../repository/entities/permission.entity';

export class ListPermissionDto {
  @ApiProperty({
    type: 'object',
    additionalProperties: {
      type: 'array',
      items: { $ref: getSchemaPath(Permission) }, // Assuming 'Permission' is the name of your IPermission interface
    },
  })
  data: { [key: string]: Permission[] };
}
