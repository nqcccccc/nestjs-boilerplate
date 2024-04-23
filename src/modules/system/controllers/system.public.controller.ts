import { System } from '@modules/system/repository/entities/system.entity';
import { Controller, Get, HttpCode, HttpStatus, Param } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { SystemService } from '../services/system.service';

@Controller('system')
@ApiTags('Systems')
export class SystemPublicController {
  constructor(private readonly service: SystemService) {}

  @Get('')
  @HttpCode(HttpStatus.OK)
  async getListPublic(): Promise<System[]> {
    return await this.service.getListPublic();
  }

  @Get(':key')
  @HttpCode(HttpStatus.OK)
  async getPublicByKey(@Param('key') key: string): Promise<System> {
    return await this.service.getPublicByKey(key);
  }
}
