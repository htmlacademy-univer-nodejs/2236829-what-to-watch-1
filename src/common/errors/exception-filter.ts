import { NextFunction, Request, Response } from 'express';
import { inject, injectable } from 'inversify';
import { StatusCodes } from 'http-status-codes';
import { ExceptionFilterInterface } from './exception-filter.interface.js';
import { Component } from '../../types/component.type.js';
import { LoggerInterface } from '../logger/logger.interface.js';

@injectable()
export default class ExceptionFilter implements ExceptionFilterInterface {
  constructor(
    @inject(Component.LoggerInterface)
    private logger: LoggerInterface
  ) {
    this.logger.info('Регистрация ExceptionFilter');
  }

  public catch(error: Error, _req: Request, res: Response, _next: NextFunction): void {
    this.logger.error(error.message);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({error: error.message});
  }
}
