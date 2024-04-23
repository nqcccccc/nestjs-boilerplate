import { ListPaginate } from '@common/database/types/database.type';
import CustomError from '@common/error/exceptions/custom-error.exception';
import { MessageService } from '@common/message/services/message.service';
import { wrapPagination } from '@common/utils/object.util';
import { Permission } from '@modules/permission/repository/entities/permission.entity';
import { PermissionRepository } from '@modules/permission/repository/repositories/permission.repository';
import { PermissionList } from '@modules/permission/types/permission.type';
import { Injectable } from '@nestjs/common';
import { I18nService } from 'nestjs-i18n';
import { In, Not } from 'typeorm';

import { CreateRoleDto } from '../dtos/create-role.dto';
import { FilterRoleDto } from '../dtos/filter-role.dto';
import { UpdateRoleDto } from '../dtos/update-role.dto';
import { Role } from '../repository/entities/role.entity';
import { RoleRepository } from '../repository/repositories/role.repository';
import { RolePermission } from '../types/role.type';

@Injectable()
export class RoleService {
  private roleMessage: MessageService;
  private permissionMessage: MessageService;

  constructor(
    private readonly roleRepository: RoleRepository,
    private readonly permissionRepository: PermissionRepository,
    i18nService: I18nService,
  ) {
    this.roleMessage = new MessageService(i18nService, 'role');
    this.permissionMessage = new MessageService(i18nService, 'permission');
  }

  async getList(params: FilterRoleDto): Promise<ListPaginate<Role>> {
    const [data, count] = await this.roleRepository.getList(params);

    return wrapPagination<Role>(data, count, params);
  }

  async create(input: CreateRoleDto): Promise<void> {
    await this._checkDuplicateSlug(input?.slug);
    const permissions = await this._checkPermissionExist(input?.permission_ids);
    const role = new Role();

    this._assignValueToRole(role, permissions, input);

    await this.roleRepository.save(role);
  }

  async update(input: UpdateRoleDto): Promise<void> {
    const role = await this.roleRepository.findOneBy({ id: input.id });
    if (!role) {
      throw new CustomError(
        404,
        'NOT_FOUND',
        this.roleMessage.getMessage('NOT_FOUND'),
      );
    }
    await this._checkDuplicateSlug(input?.slug, input?.id);

    const permissions = await this._checkPermissionExist(input?.permission_ids);

    this._assignValueToRole(role, permissions, input);

    await this.roleRepository.save(role);
  }

  async getById(id: number): Promise<RolePermission> {
    const role = await this.roleRepository.findOne({
      where: { id },
      relations: ['role_permissions', 'role_permissions.permission'],
    });

    const permissions = role.role_permissions.map((rp) => rp.permission);
    delete role.role_permissions;

    return {
      ...role,
      permissions: this._groupPermissions(permissions),
    } as unknown as RolePermission;
  }

  async delete(id: number): Promise<void> {
    const role = await this.roleRepository.findOne({
      where: { id },
      relations: ['role_users'],
    });

    if (!role) {
      throw new CustomError(
        404,
        'NOT_FOUND',
        this.roleMessage.getMessage('NOT_FOUND'),
      );
    }

    if (role.role_users.length) {
      throw new CustomError(
        400,
        'IN_USED',
        this.roleMessage.getMessage('IN_USED'),
      );
    }

    await this.roleRepository.delete(id);
  }

  async getAll(): Promise<Role[]> {
    return this.roleRepository.find({ where: { slug: Not('user_standard') } });
  }

  private async _checkDuplicateSlug(slug: string, id?: number): Promise<Role> {
    const role = await this.roleRepository.findOne({
      where: { slug: slug },
    });

    if (role) {
      if (!id || role.id !== id) {
        throw new CustomError(
          400,
          'SLUG_INVALID',
          this.roleMessage.getMessage('SLUG_INVALID'),
        );
      }
    }

    return role;
  }

  private async _checkPermissionExist(
    permission_ids: number[],
  ): Promise<Permission[]> {
    const permissions = await this.permissionRepository.findBy({
      id: In(permission_ids),
    });

    if (permissions.length !== permission_ids.length) {
      throw new CustomError(
        404,
        'NOT_FOUND',
        this.permissionMessage.getMessage('NOT_FOUND'),
      );
    }

    return permissions;
  }

  private _assignValueToRole(
    role: Role,
    permissions: Permission[],
    input: CreateRoleDto | UpdateRoleDto,
  ): void {
    Object.assign(role, {
      ...input,
      role_permissions: permissions.map((p) => ({ permission: p })),
    });
  }

  private _groupPermissions(input: Permission[]): PermissionList {
    input.sort((a, b) => {
      return a.position - b.position;
    });
    const permissionGroupObj: PermissionList = {};
    for (const permission of input) {
      const groupName: string = permission.module;
      if (!permissionGroupObj[groupName]) {
        permissionGroupObj[groupName] = [];
      }
      permissionGroupObj[groupName].push(permission);
    }
    return permissionGroupObj;
  }
}
