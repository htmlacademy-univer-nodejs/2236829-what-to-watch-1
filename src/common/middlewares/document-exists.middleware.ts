import { MiddlewareInterface } from '../../types/middleware.interface.js';
import { NextFunction, Request, Response } from 'express';
import { DocumentExistsInterface } from '../../types/document-exists.interface.js';
import HttpError from '../errors/http-error.js';
import { StatusCodes } from 'http-status-codes';

export class DocumentExistsMiddleware<IdParamName extends string, Id> implements
    MiddlewareInterface<Record<IdParamName, Id>> {
  constructor(
    private readonly service: DocumentExistsInterface<Id>,
    private readonly entityName: string,
    private readonly paramName: IdParamName,
  ) {}

  public async execute(req: Request<Record<IdParamName, Id>>, _res: Response, next: NextFunction): Promise<void> {
    const documentId = req.params[this.paramName];
    if (!await this.service.exists(documentId)) {
      throw new HttpError(
        StatusCodes.NOT_FOUND,
        `${this.entityName} с идентификатором ${documentId} не существует.`,
        'DocumentExistsMiddleware'
      );
    }

    next();
  }
}
