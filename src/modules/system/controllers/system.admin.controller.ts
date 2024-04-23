import { Auth } from '@auth/decorators/auth.jwt.decorator';
import { ListPaginate } from '@common/database/types/database.type';
import { ApiPaginatedResponse } from '@common/response/decorators/paginate-response.decorator';
import { CreateSystemDto } from '@modules/system/dtos/create-system.dto';
import { FilterSystemDto } from '@modules/system/dtos/filter-system.dto';
import { UpdateSystemDto } from '@modules/system/dtos/update-system.dto';
import { System } from '@modules/system/repository/entities/system.entity';
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

import { SystemService } from '../services/system.service';

@Controller('system')
@ApiTags('Systems')
@ApiBearerAuth('accessToken')
export class SystemAdminController {
  constructor(private readonly service: SystemService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @Auth({ permissions: 'system_manager_create' })
  async create(@Body() body: CreateSystemDto): Promise<void> {
    return this.service.create(body);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @Auth({ permissions: 'system_manager_read' })
  @ApiPaginatedResponse({ type: System })
  async getList(
    @Query() param: FilterSystemDto,
  ): Promise<ListPaginate<System>> {
    return await this.service.getList(param);
  }

  @Get('/by-key/:key')
  @HttpCode(HttpStatus.OK)
  @Auth({ permissions: 'system_manager_read' })
  @ApiOkResponse({ type: System })
  async getByKey(@Param('key') key: string): Promise<System> {
    return await this.service.getByKey(key);
  }

  @Get(':id([0-9]+)')
  @HttpCode(HttpStatus.OK)
  @Auth({ permissions: 'system_manager_read' })
  @ApiOkResponse({ type: System })
  async getById(@Param('id') id: number): Promise<System> {
    return await this.service.getById(id);
  }

  @Put()
  @HttpCode(HttpStatus.NO_CONTENT)
  @Auth({ permissions: 'system_manager_update' })
  async update(@Body() body: UpdateSystemDto): Promise<void> {
    return await this.service.update(body);
  }

  @Delete(':id([0-9]+)')
  @HttpCode(HttpStatus.NO_CONTENT)
  @Auth({ permissions: 'system_manager_delete' })
  async delete(@Param('id') id: number): Promise<void> {
    return await this.service.delete(id);
  }
}
