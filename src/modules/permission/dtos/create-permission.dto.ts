import { SLUG_REGEX } from '@app/constant/app.constant';
import {
  IsInt,
  IsNotEmpty,
  IsString,
  Matches,
  MaxLength,
} from 'class-validator';

export class CreatePermissionDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  name: string;

  @IsNotEmpty()
  @IsString()
  @Matches(SLUG_REGEX)
  @MaxLength(255)
  slug: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  module: string;

  @IsNotEmpty()
  @IsInt()
  position: number;
}
