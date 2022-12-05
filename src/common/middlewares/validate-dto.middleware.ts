import { NextFunction, Request, Response } from 'express';
import { ClassConstructor } from 'class-transformer/types/interfaces/class-constructor.type.js';
import { validate, ValidationError } from 'class-validator';
import { StatusCodes } from 'http-status-codes';
import { plainToInstance } from 'class-transformer';
import { MiddlewareInterface } from '../../types/middleware.interface.js';

export class ValidateDtoMiddleware<Dto extends object> implements MiddlewareInterface<unknown, ValidationError[], Dto> {
  constructor(private dto: ClassConstructor<Dto>) {}

  public async execute(req: Request<unknown, ValidationError[], Dto>, res: Response<ValidationError[]>, next: NextFunction): Promise<void> {
    const dtoInstance = plainToInstance(this.dto, req.body);
    const errors = await validate(dtoInstance);

    if (errors.length > 0) {
      res.status(StatusCodes.BAD_REQUEST).send(errors);
      return;
    }

    next();
  }
}
