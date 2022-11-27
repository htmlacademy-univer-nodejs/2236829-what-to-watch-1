import { NextFunction, Request, Response } from 'express';

export interface MiddlewareInterface<P, ResBody, ReqBody, ReqQuery, Locals extends Record<string, unknown>> {
  execute(req: Request<P, ResBody, ReqBody, ReqQuery, Locals>, res: Response<ResBody, Locals>, next: NextFunction): void;
}
