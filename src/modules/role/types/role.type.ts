import { PermissionList } from '@modules/permission/types/permission.type';

import { Role } from '../repository/entities/role.entity';

export type RolePermission = Omit<Role, 'role_permissions'> & {
  permissions: PermissionList[];
};
