import { Auth } from '@auth/decorators/auth.jwt.decorator';
import { ListPaginate } from '@common/database/types/database.type';
import { ApiPaginatedResponse } from '@common/response/decorators/paginate-response.decorator';
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';

import { CreateRoleDto } from '../dtos/create-role.dto';
import { FilterRoleDto } from '../dtos/filter-role.dto';
import { UpdateRoleDto } from '../dtos/update-role.dto';
import { Role } from '../repository/entities/role.entity';
import { RoleService } from '../services/role.service';
import { RolePermission } from '../types/role.type';

@Controller('roles')
@ApiTags('Roles')
@ApiBearerAuth('accessToken')
export class RoleAdminController {
  constructor(private readonly service: RoleService) {}

  @Post()
  @Auth({ permissions: 'role_manage_create' })
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() body: CreateRoleDto): Promise<void> {
    return await this.service.create(body);
  }

  @Get('/:id([0-9]+)')
  @Auth({ permissions: 'role_manage_read' })
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: Role })
  async getById(@Param('id') id: number): Promise<RolePermission> {
    return await this.service.getById(id);
  }

  @Get()
  @Auth({ permissions: 'role_manage_read' })
  @HttpCode(HttpStatus.OK)
  @ApiPaginatedResponse({ type: Role })
  async getList(@Query() param: FilterRoleDto): Promise<ListPaginate<Role>> {
    return await this.service.getList(param);
  }

  @Get('/all')
  @HttpCode(HttpStatus.OK)
  @Auth()
  @ApiOkResponse({ type: Role, isArray: true })
  async getAll(): Promise<Role[]> {
    return await this.service.getAll();
  }

  @Put()
  @Auth({ permissions: 'role_manage_update' })
  @HttpCode(HttpStatus.NO_CONTENT)
  async update(@Body() body: UpdateRoleDto): Promise<void> {
    return await this.service.update(body);
  }

  @Delete(':id([0-9]+)')
  @Auth({ permissions: 'role_manage_delete' })
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id') id: number): Promise<void> {
    return this.service.delete(id);
  }
}
