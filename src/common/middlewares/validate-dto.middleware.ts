import { NextFunction, Request, Response } from 'express';
import { ClassConstructor } from 'class-transformer/types/interfaces/class-constructor.type.js';
import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { transformErrors } from '../../utils/common.js';
import { MiddlewareInterface } from '../../types/middleware.interface.js';
import ValidationError from '../errors/validation-error.js';

export class ValidateDtoMiddleware<Dto extends object> implements MiddlewareInterface<unknown, ValidationError[], Dto> {
  constructor(private dto: ClassConstructor<Dto>) {}

  public async execute(req: Request<unknown, ValidationError[], Dto>, _res: Response<ValidationError[]>, next: NextFunction): Promise<void> {
    const dtoInstance = plainToInstance(this.dto, req.body);
    const errors = await validate(dtoInstance);

    if (errors.length > 0) {
      throw new ValidationError(`Validation error: "${req.path}"`, transformErrors(errors));
    }

    next();
  }
}
