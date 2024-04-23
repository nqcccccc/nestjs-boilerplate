import { Auth } from '@auth/decorators/auth.jwt.decorator';
import { AuthUser } from '@auth/types/auth.type';
import { AUser } from '@common/request/decorators/params/request.params.decorator';
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
} from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';

import { CreatePermissionDto } from '../dtos/create-permission.dto';
import { ListPermissionDto } from '../dtos/list-permission.dto';
import { UpdatePermissionDto } from '../dtos/update-permission.dto';
import { PermissionService } from '../services/permission.service';
import { PermissionList } from '../types/permission.type';

@Controller('permissions')
@ApiTags('Permissions')
@ApiBearerAuth('accessToken')
export class PermissionAdminController {
  constructor(private readonly service: PermissionService) {}

  @Post()
  @Auth({ permissions: 'permission_manage_create' })
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() body: CreatePermissionDto): Promise<void> {
    return this.service.create(body);
  }

  @Get()
  @Auth({ permissions: 'permission_manage_read' })
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: ListPermissionDto })
  async getAll(): Promise<PermissionList> {
    return this.service.getAll();
  }

  @Get('/my-permission')
  @Auth()
  @HttpCode(HttpStatus.OK)
  async getMyPermission(@AUser() user: AuthUser): Promise<string[]> {
    return this.service.getMyPermission(user as AuthUser);
  }

  @Put()
  @Auth({ permissions: 'permission_manage_update' })
  @HttpCode(HttpStatus.NO_CONTENT)
  async update(@Body() body: UpdatePermissionDto): Promise<void> {
    return this.service.update(body);
  }

  @Delete(':id([0-9]+)')
  @Auth({ permissions: 'permission_manage_delete' })
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id') id: number): Promise<void> {
    return this.service.delete(id);
  }
}
