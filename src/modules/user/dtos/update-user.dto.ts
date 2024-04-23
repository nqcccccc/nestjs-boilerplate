import { PartialType } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  IsUUID,
  MaxLength,
  MinLength,
} from 'class-validator';

import { CreateUserDto } from './create-user.dto';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @IsNotEmpty()
  @IsUUID()
  id: string;
}

export class ChangePasswordDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  @MaxLength(60)
  new_password: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  @MaxLength(60)
  current_password: string;
}

export class ResetPasswordDto {
  @IsNotEmpty()
  @IsUUID()
  id: string;
}
