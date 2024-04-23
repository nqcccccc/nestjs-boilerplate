import { Injectable } from '@nestjs/common';
import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ async: true })
@Injectable()
export class IsGreaterConstraint implements ValidatorConstraintInterface {
  validate(value: number, args: ValidationArguments): boolean {
    if (!value) return true;
    const [compare] = args.constraints;
    return value > args.object[compare];
  }
}

export function IsGreater(
  compare: string,
  validationOptions?: ValidationOptions,
) {
  return function (object: Record<string, any>, propertyName: string): void {
    registerDecorator({
      name: 'IsGreater',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [compare],
      validator: IsGreaterConstraint,
    });
  };
}
