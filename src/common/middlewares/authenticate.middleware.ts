import { NextFunction, Request, Response } from 'express';
import * as jose from 'jose';
import { MiddlewareInterface } from '../../types/middleware.interface.js';
import { KeyObject, createSecretKey } from 'crypto';
import HttpError from '../errors/http-error.js';
import { StatusCodes } from 'http-status-codes';

export class AuthenticateMiddleware implements MiddlewareInterface {
  private readonly jwtSecret: KeyObject;

  constructor(jwtSecret: string) {
    this.jwtSecret = createSecretKey(jwtSecret, 'utf-8');
  }

  public async execute(req: Request, _res: Response, next: NextFunction): Promise<void> {
    const authorizationHeaderValue = req.headers?.authorization?.split(' ', 2);

    if (!authorizationHeaderValue || authorizationHeaderValue[0] !== 'Bearer') {
      return next();
    }

    const token = authorizationHeaderValue[1];

    try {
      const {payload} = await jose.jwtVerify(token, this.jwtSecret);

      if (!payload.email || !payload.id) {
        throw new Error('Bad Request');
      }

      req.user = {email: `${payload.email}`, id: `${payload.id}`};

      return next();
    } catch {
      return next(new HttpError(
        StatusCodes.UNAUTHORIZED,
        'Invalid token',
        'AuthenticateMiddleware'
      ));
    }
  }
}
