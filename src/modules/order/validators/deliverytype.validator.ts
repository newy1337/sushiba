import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ async: false })
class IsOnlyOneSelectedConstraint implements ValidatorConstraintInterface {
  validate(value: any, args: ValidationArguments) {
    const object = args.object as any;
    return (
      (object.deliveryNow && !object.preorder) ||
      (!object.deliveryNow && object.preorder)
    );
  }

  defaultMessage() {
    return 'Either deliveryNow or preorder must be true, but not both';
  }
}

export function IsOnlyOneSelected(validationOptions?: ValidationOptions) {
  return function (object: NonNullable<unknown>, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsOnlyOneSelectedConstraint,
    });
  };
}
