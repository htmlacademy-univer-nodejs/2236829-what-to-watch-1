import { HttpMethod } from './http-method.enum.js';
import { NextFunction, Request, Response } from 'express';
import { MiddlewareInterface } from './middleware.interface.js';

export interface RouteInterface<P, ResBody, ReqBody, ReqQuery, Locals extends Record<string, unknown>> {
  path: string;
  method: HttpMethod;
  handler: (
    req: Request<P, ResBody, ReqBody, ReqQuery, Locals>,
    res: Response<ResBody, Locals>,
    next: NextFunction
  ) => void;
  middlewares?: MiddlewareInterface<P, ResBody, ReqBody, ReqQuery, Locals>[];
}
