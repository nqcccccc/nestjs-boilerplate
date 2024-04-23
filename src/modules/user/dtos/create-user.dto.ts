import { EStatus } from '@app/constant/app.enum';
import { IsEnumValue } from '@common/request/validations/request.enum-value.validation';
import { IsValidPhone } from '@common/request/validations/request.valid-phone.validation';
import { Transform, Type } from 'class-transformer';
import {
  IsEmail,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  ValidateNested,
} from 'class-validator';

class ProfileDto {
  @IsOptional()
  @MaxLength(255)
  full_name: string;

  @IsOptional()
  @IsValidPhone()
  phone: string;
}

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(50)
  @Transform(({ value }) => value?.toString()?.trim()?.toLowerCase())
  username: string;

  @IsOptional()
  @IsEmail()
  @MaxLength(255)
  email: string;

  @IsEnumValue(EStatus)
  status: EStatus;

  @IsOptional()
  @IsInt({ each: true })
  role_ids: number[];

  @Type(() => ProfileDto)
  @ValidateNested({ each: true })
  profile: ProfileDto;
}
