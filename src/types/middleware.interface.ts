import { NextFunction, Request, Response } from 'express';

export interface MiddlewareInterface<
    P = Record<string, unknown>,
    ResBody = Record<string, unknown>,
    ReqBody = Record<string, unknown>,
    ReqQuery = Record<string, unknown>,
    Locals extends Record<string, unknown> = Record<string, unknown>
  > {
  execute(req: Request<P, ResBody, ReqBody, ReqQuery, Locals>, res: Response<ResBody, Locals>, next: NextFunction): void;
}
