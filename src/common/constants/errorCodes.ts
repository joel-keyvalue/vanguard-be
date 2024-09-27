import { CustomErrors } from '../types/customError.type';

export const ErrorCodes: CustomErrors = {
  INTERNAL_SERVER_ERROR: {
    CODE: 'INTERNAL_SERVER_ERROR',
    MESSAGE: 'An unexpected error happened. Please try again later.',
  },
  NOT_FOUND: {
    CODE: 'NOT_FOUND',
    MESSAGE: 'The requested route was not found',
  },
  ENTITY_NOT_FOUND: {
    CODE: 'ENTITY_NOT_FOUND',
    MESSAGE: 'The requested entity was not found',
  },
  ENTITY_ALREADY_EXISTS: {
    CODE: 'ENTITY_ALREADY_EXISTS',
    MESSAGE: 'Cannot create entity as it already exists',
  },
  VALIDATION_FAILED: {
    CODE: 'VALIDATION_FAILED',
    MESSAGE: 'Failed to validate given entity',
  },
  UNAUTHENTICATED: {
    CODE: 'UNAUTHENTICATED',
    MESSAGE: 'You need to be logged in to perform this operation',
  },
  FORBIDDEN: {
    CODE: 'FORBIDDEN',
    MESSAGE: 'You are not allowed to perform this operation',
  },
  INVALID_REFRESH_TOKEN: {
    CODE: 'INVALID_REFRESH_TOKEN',
    MESSAGE: 'Refresh token provided is invalid. Please provide a valid token.',
  },
};
