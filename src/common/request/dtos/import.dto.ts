import { IsNotEmpty, IsString } from 'class-validator';

export class BaseImportDto {
  @IsNotEmpty()
  @IsString()
  key: string;
}
