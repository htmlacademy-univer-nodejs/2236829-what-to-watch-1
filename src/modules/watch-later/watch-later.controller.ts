import { Request, Response } from 'express';
import { inject, injectable } from 'inversify';
import { Controller } from '../../common/controller/controller.js';
import { Component } from '../../types/component.type.js';
import { LoggerInterface } from '../../common/logger/logger.interface.js';
import { HttpMethod } from '../../types/http-method.enum.js';
import { fillDto } from '../../utils/common.js';
import HttpError from '../../common/errors/http-error.js';
import { StatusCodes } from 'http-status-codes';
import { ValidateDtoMiddleware } from '../../common/middlewares/validate-dto.middleware.js';
import { AuthorizeMiddleware } from '../../common/middlewares/authorize.middleware.js';
import { WatchLaterServiceInterface } from '../watch-later/watch-later-service.interface.js';
import AddToWatchLaterDto from '../watch-later/dto/add-to-watch-later.dto.js';
import DeleteFromWatchLaterDto from '../watch-later/dto/delete-from-watch-later.dto.js';
import { ConfigInterface } from '../../common/config/config.interface.js';
import MovieListItemResponse from '../movie/response/movie-list-item.response.js';
import { MovieServiceInterface } from '../movie/movie-service.interface.js';

@injectable()
export default class WatchLaterController extends Controller {
  constructor(
    @inject(Component.MovieServiceInterface)
    private readonly movieService: MovieServiceInterface,
    @inject(Component.WatchLaterServiceInterface)
    private readonly WatchLaterService: WatchLaterServiceInterface,
    @inject(Component.ConfigInterface)
    configService: ConfigInterface,
    @inject(Component.LoggerInterface)
    logger: LoggerInterface,
  ) {
    super(logger, configService);

    this.logger.info('Регистрация эндпоинтов для WatchLaterController…');

    const validateAddToWatchLaterDtoMiddleware = new ValidateDtoMiddleware(AddToWatchLaterDto);
    const validateDeleteFromWatchLaterDtoMiddleware = new ValidateDtoMiddleware(DeleteFromWatchLaterDto);
    const authorizationMiddleware = new AuthorizeMiddleware();

    this.addRoute({
      path: '/',
      method: HttpMethod.Get,
      handler: this.getWatchLaterList,
      middlewares: [authorizationMiddleware]
    });

    this.addRoute({
      path: '/',
      method: HttpMethod.Post,
      handler: this.addToWatchLaterList,
      middlewares: [authorizationMiddleware, validateAddToWatchLaterDtoMiddleware]
    });

    this.addRoute({
      path: '/',
      method: HttpMethod.Delete,
      handler: this.deleteFromWatchLaterList,
      middlewares: [authorizationMiddleware, validateDeleteFromWatchLaterDtoMiddleware]
    });
  }

  public async getWatchLaterList(
    req: Request<Record<string, unknown>, MovieListItemResponse[]>,
    res: Response<MovieListItemResponse[]>
  ): Promise<void> {
    const result = await this.WatchLaterService.getWatchLater(req.user.id);
    this.ok(res, fillDto(MovieListItemResponse, result?.list ?? []));
  }

  public async addToWatchLaterList(
    req: Request<Record<string, unknown>, Record<string, unknown>, AddToWatchLaterDto>,
    res: Response<Record<string, unknown>>
  ): Promise<void> {
    const movieExists = await this.movieService.exists(req.body.movieId);
    if (movieExists) {
      throw new HttpError(
        StatusCodes.NOT_FOUND,
        'Фильм не найден',
        'WatchLaterController',
      );
    }
    await this.WatchLaterService.addToWatchLater(req.user.id, req.body.movieId);
    this.noContent(res);
  }

  public async deleteFromWatchLaterList(
    req: Request<Record<string, unknown>, Record<string, unknown>, DeleteFromWatchLaterDto>,
    res: Response<Record<string, unknown>>
  ): Promise<void> {
    const movieExists = await this.movieService.exists(req.body.movieId);
    if (movieExists) {
      throw new HttpError(
        StatusCodes.NOT_FOUND,
        'Фильм не найден',
        'WatchLaterController',
      );
    }
    await this.WatchLaterService.deleteFromWatchLater(req.user.id, req.body.movieId);
    this.noContent(res);
  }
}
