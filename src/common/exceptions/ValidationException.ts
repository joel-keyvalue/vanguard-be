import { HttpStatus, ValidationError } from '@nestjs/common';
import { CustomError } from '../types/customError.type';
import { AppException } from './AppException';
import { ErrorCodes } from '../constants/errorCodes';

export class ValidationException extends AppException {
  constructor(error: CustomError) {
    super(error, HttpStatus.BAD_REQUEST);
  }
}

export class ClassValidatorException extends ValidationException {
  constructor(errors: ValidationError[]) {
    const error = {
      CODE: ErrorCodes.VALIDATION_FAILED.CODE,
      MESSAGE: ErrorCodes.VALIDATION_FAILED.MESSAGE,
      DETAILS: getErrorMessages(errors),
    };
    super(error);
  }
}

const getErrorMessages = (errors: ValidationError[]): string[] => {
  const errorDetails = errors.map((error) => {
    if (error.constraints) {
      return Object.values(error.constraints);
    } else if (error.children?.length > 0) {
      const childErrors = getErrorMessages(error.children);
      return childErrors.map((childError) => error.property + '.' + childError);
    }
  });

  return errorDetails.flat(2);
};
