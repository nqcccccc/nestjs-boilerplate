import { AuthUser } from '@auth/types/auth.type';
import CustomError from '@common/error/exceptions/custom-error.exception';
import { Injectable } from '@nestjs/common';

import { CreatePermissionDto } from '../dtos/create-permission.dto';
import { UpdatePermissionDto } from '../dtos/update-permission.dto';
import { Permission } from '../repository/entities/permission.entity';
import { PermissionRepository } from '../repository/repositories/permission.repository';
import { PermissionList } from '../types/permission.type';

@Injectable()
export class PermissionService {
  constructor(private readonly permissionRepository: PermissionRepository) {}

  async create(input: CreatePermissionDto): Promise<void> {
    await this._checkDuplicateSlug(input?.slug);

    await this.permissionRepository.save(input);
  }

  async getAll(): Promise<PermissionList> {
    const permissions = await this.permissionRepository.find();

    return this._groupPermission(permissions);
  }

  async getMyPermission(user: AuthUser): Promise<string[]> {
    const permissions = await this.permissionRepository.getAllSlugByUserId(
      user.id,
    );
    return permissions?.map((p) => p.slug);
  }

  async update(input: UpdatePermissionDto): Promise<void> {
    const permission = await this._checkDuplicateSlug(input?.slug, input?.id);

    if (!permission) {
      throw new CustomError(404, 'NOT_FOUND', 'Permission not found ');
    }

    Object.assign(permission, input);

    await this.permissionRepository.save(permission);
  }

  async delete(id: number): Promise<void> {
    await this.permissionRepository.delete(id);
  }

  private async _checkDuplicateSlug(
    slug: string,
    id?: number,
  ): Promise<Permission> {
    const permission = await this.permissionRepository.findOne({
      where: { slug: slug },
    });

    if (permission) {
      if (!id) {
        throw new CustomError(400, 'BAD_REQUEST', 'Duplicate code !');
      }
    }

    return permission;
  }

  private _groupPermission(permissions: Permission[]): {
    [key: string]: Permission[];
  } {
    permissions.sort((a, b) => {
      return a.position - b.position;
    });
    const permissionGroupObj: PermissionList = {};
    for (const permission of permissions) {
      const groupName: string = permission.module;
      if (!permissionGroupObj[groupName]) {
        permissionGroupObj[groupName] = [];
      }
      permissionGroupObj[groupName].push(permission);
    }
    return permissionGroupObj;
  }
}
