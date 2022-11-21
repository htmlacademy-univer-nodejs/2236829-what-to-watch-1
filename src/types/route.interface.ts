import { HttpMethod } from './http-method.enum.js';
import { NextFunction, Request, Response } from 'express';

export interface RouteInterface<P, ResBody, ReqBody, ReqQuery, Locals extends Record<string, any>> {
  path: string;
  method: HttpMethod;
  handler: (req: Request<P, ResBody, ReqBody, ReqQuery, Locals>, res: Response<ResBody, Locals>, next: NextFunction) => void;
}

