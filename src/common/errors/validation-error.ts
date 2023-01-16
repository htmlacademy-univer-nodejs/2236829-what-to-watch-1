import { PropertyValidationError } from '../../types/property-validation-error.type.js';
import { StatusCodes } from 'http-status-codes';

export default class ValidationError extends Error {
  public httpStatusCode: number;
  public details: PropertyValidationError[];

  constructor(message: string, errors: PropertyValidationError[]) {
    super(message);

    this.httpStatusCode = StatusCodes.BAD_REQUEST;
    this.message = message;
    this.details = errors;
  }
}
