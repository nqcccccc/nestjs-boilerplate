import { PHONE_REGEX } from '@app/constant/app.constant';
import { Injectable } from '@nestjs/common';
import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ async: true })
@Injectable()
export class IsValidPhoneConstraint implements ValidatorConstraintInterface {
  validate(value: string): boolean {
    if (!value?.toString()?.trim()) return true;
    return !!PHONE_REGEX.test(value);
  }
}

export function IsValidPhone(validationOptions?: ValidationOptions) {
  return function (object: Record<string, any>, propertyName: string): void {
    registerDecorator({
      name: 'IsValidPhone',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: IsValidPhoneConstraint,
    });
  };
}
