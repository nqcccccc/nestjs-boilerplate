import { EStatus } from '@app/constant/app.enum';
import { ListPaginate } from '@common/database/types/database.type';
import CustomError from '@common/error/exceptions/custom-error.exception';
import { MessageService } from '@common/message/services/message.service';
import { wrapPagination } from '@common/utils/object.util';
import { CreateSystemDto } from '@modules/system/dtos/create-system.dto';
import { FilterSystemDto } from '@modules/system/dtos/filter-system.dto';
import { UpdateSystemDto } from '@modules/system/dtos/update-system.dto';
import { System } from '@modules/system/repository/entities/system.entity';
import { SystemRepository } from '@modules/system/repository/repositories/system.repository';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { I18nService } from 'nestjs-i18n';
import { FindOneOptions, In, Not } from 'typeorm';

@Injectable()
export class SystemService {
  private systemMessage: MessageService;

  constructor(
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
    private readonly systemRepository: SystemRepository,
    i18nService: I18nService,
  ) {
    this.systemMessage = new MessageService(i18nService, 'system');
  }

  async getList(params: FilterSystemDto): Promise<ListPaginate<System>> {
    const [data, count] = await this.systemRepository.getList(params);

    return wrapPagination<System>(data, count, params);
  }

  async create(input: CreateSystemDto): Promise<void> {
    await this._checkDuplicateKey(input.key);
    const obj = new System();
    Object.assign(obj, input);
    await this.systemRepository.save(obj);
  }

  async update(input: UpdateSystemDto): Promise<void> {
    delete input.key;
    const data = await this.systemRepository.findOne({
      where: { id: input.id },
    });
    if (!data) {
      throw new CustomError(
        404,
        'NOT_FOUND',
        this.systemMessage.getMessage('NOT_FOUND'),
      );
    }
    await this._cachingSpecialKey(data.key, data.value);
    await this.systemRepository.save(Object.assign(data, input));
  }

  async getById(id: number): Promise<System> {
    const options: FindOneOptions<System> = { where: { id } };
    const data = await this.systemRepository.findOne(options);
    if (!data) {
      throw new CustomError(
        404,
        'NOT_FOUND',
        this.systemMessage.getMessage('NOT_FOUND'),
      );
    }
    return data;
  }

  async getByKey(key: string): Promise<System> {
    const options: FindOneOptions<System> = { where: { key } };
    const data = await this.systemRepository.findOne(options);
    if (!data) {
      throw new CustomError(404, 'NOT_FOUND', 'System not found !');
    }
    return data;
  }

  async delete(id: number): Promise<void> {
    const data = await this.systemRepository.findOne({
      where: { id },
    });

    if (!data) {
      throw new CustomError(
        404,
        'NOT_FOUND',
        this.systemMessage.getMessage('NOT_FOUND'),
      );
    }

    await this.systemRepository.delete(id);
  }

  async getListPublic(): Promise<System[]> {
    return await this.systemRepository.find({
      where: { is_public: EStatus.active, status: EStatus.active },
    });
  }

  async getPublicByKey(key: string): Promise<System> {
    const data = await this.systemRepository.findOne({
      where: { is_public: EStatus.active, status: EStatus.active, key },
    });
    if (!data) {
      throw new CustomError(
        404,
        'NOT_FOUND',
        this.systemMessage.getMessage('NOT_FOUND'),
      );
    }
    return data;
  }

  async cachingDefaultValue(): Promise<void> {
    const systems = await this.systemRepository.findBy({
      key: In(['BANK_CODE', 'BANK_NO', 'NOTIFY_ID']),
    });

    for (const system of systems) {
      await this._cachingSpecialKey(
        system.key,
        Array.isArray(system.value) ? system.value[0] : system.value,
      );
    }
  }

  private async _checkDuplicateKey(key: string, id?: number): Promise<void> {
    const system = await this.systemRepository.findOne({
      where: { key: key, id: Not(id || -1) },
    });

    if (system) {
      throw new CustomError(
        400,
        'KEY_INVALID',
        this.systemMessage.getMessage('KEY_INVALID'),
      );
    }
  }

  private async _cachingSpecialKey(key: string, value: string): Promise<void> {
    switch (key) {
      case 'NOTIFY_ID':
        await this.cacheManager.set('notify_id', value);
        break;
      case 'BANK_CODE':
        await this.cacheManager.set('bank_code', value);
        break;
      case 'BANK_NO':
        await this.cacheManager.set('bank_no', value?.toString());
        break;
      default:
    }
  }
}
