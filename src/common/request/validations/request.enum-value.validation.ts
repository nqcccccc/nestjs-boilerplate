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
export class IsEnumValueConstraint implements ValidatorConstraintInterface {
  validate(value: string | number, args: ValidationArguments): boolean {
    const [property] = args.constraints;

    return value in property;
  }
}

export function IsEnumValue(
  property: any,
  validationOptions?: ValidationOptions,
) {
  return function (object: Record<string, any>, propertyName: string): void {
    registerDecorator({
      name: 'IsEnumValue',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [property],
      validator: IsEnumValueConstraint,
    });
  };
}
