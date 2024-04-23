import { EStatus } from '@app/constant/app.enum';
import { CheckDateRange } from '@common/request/validations/request.date-range.validation';
import { IsEnumValue } from '@common/request/validations/request.enum-value.validation';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsISO8601,
  IsNumber,
  IsOptional,
  IsString,
  Matches,
} from 'class-validator';

export class BaseFilterParamDto {
  @IsOptional()
  @IsString()
  filter?: string;

  @ApiProperty({ type: Number, required: false })
  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => parseInt(value))
  limit = 10;

  @ApiProperty({ type: Number, required: false })
  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => parseInt(value))
  page = 1;

  @ApiProperty({ type: String, required: false })
  @IsOptional()
  @Matches(/(?<column>[a-z]+(_[a-z]+)?)\s(?<dir>(asc|desc))$/)
  @IsString()
  sorting = 'created_at desc';

  @ApiProperty({ enum: EStatus, required: false })
  @IsOptional()
  @IsEnumValue(EStatus)
  @Transform(({ value }) => parseInt(value))
  status: EStatus;

  @IsOptional()
  @IsISO8601()
  @ApiProperty({
    required: false,
  })
  date_from: Date;

  @IsOptional()
  @IsISO8601()
  @CheckDateRange(30, 'date_from')
  @ApiProperty({
    required: false,
  })
  date_to: Date;
}
