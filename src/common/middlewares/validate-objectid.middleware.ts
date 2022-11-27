import mongoose from 'mongoose';
import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { MiddlewareInterface } from '../../types/middleware.interface.js';
import { ObjectId, ObjectIdLike } from 'bson';
import HttpError from '../errors/http-error.js';

const { Types } = mongoose;

export class ValidateObjectIdMiddleware<IdParam extends string> implements
    MiddlewareInterface<Record<IdParam, string | number | ObjectId | ObjectIdLike | Buffer | Uint8Array>> {
  constructor(private param: IdParam) {}

  public execute(req: Request<Record<IdParam, string | number | ObjectId | ObjectIdLike | Buffer | Uint8Array>>, _res: Response, next: NextFunction): void {
    const objectId = req.params[this.param];

    if (Types.ObjectId.isValid(objectId)) {
      return next();
    }

    throw new HttpError(
      StatusCodes.BAD_REQUEST,
      `${objectId} не является валидным ObjectID`,
      'ValidateObjectIdMiddleware'
    );
  }
}
