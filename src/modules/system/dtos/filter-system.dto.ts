import { EStatus } from '@app/constant/app.enum';
import { BaseFilterParamDto } from '@common/database/dtos/base-filter.dto';
import { IsEnumValue } from '@common/request/validations/request.enum-value.validation';
import { IsOptional, IsString } from 'class-validator';

export class FilterSystemDto extends BaseFilterParamDto {
  @IsOptional()
  @IsString()
  group: string;

  @IsOptional()
  @IsEnumValue(EStatus)
  is_public: EStatus;
}
