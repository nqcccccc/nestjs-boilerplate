import { BaseFilterParamDto } from '@common/database/dtos/base-filter.dto';
import { IsArray, IsOptional } from 'class-validator';

export class FilterUserDto extends BaseFilterParamDto {
  @IsOptional()
  @IsArray()
  roles?: string[];
}
