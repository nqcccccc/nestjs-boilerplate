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
export class IsGreaterThanOrEqualToDayConstraint
  implements ValidatorConstraintInterface
{
  validate(value: string, args: ValidationArguments): boolean {
    const [compare] = args.constraints;
    let compareValue;
    if (compare === 'now') {
      compareValue = dayjs();
    } else if (args.object[compare]) {
      compareValue = args.object[compare];
    } else {
      compareValue = dayjs(compare);
    }
    return dayjs(value).diff(compareValue) >= 0;
  }
}

export function IsGreaterThanOrEqualToDay(
  compare: string,
  validationOptions?: ValidationOptions,
) {
  return function (object: Record<string, any>, propertyName: string): void {
    registerDecorator({
      name: 'IsGreaterThanOrEqualToDay',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [compare],
      validator: IsGreaterThanOrEqualToDayConstraint,
    });
  };
}
