import { Injectable } from '@nestjs/common';
import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import dayjs from 'dayjs';

@ValidatorConstraint({ async: true })
@Injectable()
export class checkDateRangeConstraint implements ValidatorConstraintInterface {
  validate(value: string, args: ValidationArguments): boolean {
    const [compareValue, compareKey] = args.constraints;
    const comparingValue = args.object[compareKey];

    return Math.abs(dayjs(value).diff(comparingValue, 'days')) <= +compareValue;
  }

  defaultMessage?(validationArguments?: ValidationArguments): string {
    const [compareValue] = validationArguments.constraints;
    return compareValue.toString();
  }
}

export function CheckDateRange(
  compareValue: number,
  compareKey?: string,
  validationOptions?: ValidationOptions,
) {
  return function (object: Record<string, any>, propertyName: string): void {
    registerDecorator({
      name: 'CheckDateRange',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [compareValue, compareKey],
      validator: checkDateRangeConstraint,
    });
  };
}
