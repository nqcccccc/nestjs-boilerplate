import { EStatus, ESystemType } from '@app/constant/app.enum';
import { IsEnumValue } from '@common/request/validations/request.enum-value.validation';
import { Transform } from 'class-transformer';
import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateSystemDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  @Transform(({ value }) => value?.toString()?.trim())
  name: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  @Transform(({ value }) => value?.toString()?.trim())
  key: string;

  @IsNotEmpty()
  @IsString()
  value: string;

  @IsNotEmpty()
  @IsEnumValue(ESystemType)
  unit: ESystemType;

  @IsNotEmpty()
  @IsString()
  group: string;

  @IsOptional()
  @IsEnumValue(EStatus)
  is_public = EStatus.active;

  @IsOptional()
  @IsEnumValue(EStatus)
  status = EStatus.active;
}
