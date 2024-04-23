import { Permission } from '../repository/entities/permission.entity';

export interface PermissionList {
  [key: string]: Permission[];
}
