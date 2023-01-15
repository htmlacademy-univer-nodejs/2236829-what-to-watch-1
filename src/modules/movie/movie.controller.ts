import { Request, Response } from 'express';
import { inject, injectable } from 'inversify';
import { Controller } from '../../common/controller/controller.js';
import { Component } from '../../types/component.type.js';
import { LoggerInterface } from '../../common/logger/logger.interface.js';
import { HttpMethod } from '../../types/http-method.enum.js';
import { MovieServiceInterface } from './movie-service.interface.js';
import MovieListItemResponse from './response/movie-list-item.response.js';
import { fillDto } from '../../utils/common.js';
import CreateMovieDto from './dto/create-movie.dto.js';
import { Genre } from '../../types/genre.type.js';
import MovieResponse from './response/movie.response.js';
import { ConfigInterface } from '../../common/config/config.interface.js';
import HttpError from '../../common/errors/http-error.js';
import { StatusCodes } from 'http-status-codes';
import CreateCommentDto from '../comment/dto/create-comment.dto.js';
import CommentDto from '../comment/dto/comment.dto.js';
import { CommentServiceInterface } from '../comment/comment-service.interface.js';
import { ValidateObjectIdMiddleware } from '../../common/middlewares/validate-objectid.middleware.js';
import { ValidateDtoMiddleware } from '../../common/middlewares/validate-dto.middleware.js';
import ValidationError from '../../common/errors/validation-error.js';
import { DocumentExistsMiddleware } from '../../common/middlewares/document-exists.middleware.js';
import { AuthorizeMiddleware } from '../../common/middlewares/authorize.middleware.js';

@injectable()
export default class MovieController extends Controller {
  constructor(
    @inject(Component.MovieServiceInterface)
    private readonly movieService: MovieServiceInterface,
    @inject(Component.CommentServiceInterface)
    private readonly commentService: CommentServiceInterface,
    @inject(Component.ConfigInterface)
    configService: ConfigInterface,
    @inject(Component.LoggerInterface)
    logger: LoggerInterface,
  ) {
    super(logger, configService);

    this.logger.info('Регистрация эндпоинтов для MovieController…');

    const validateObjectIdMiddleware = new ValidateObjectIdMiddleware('id');
    const validateCommentDtoMiddleware = new ValidateDtoMiddleware(CreateCommentDto);
    const validateMovieDtoMiddleware = new ValidateDtoMiddleware(CreateMovieDto);
    const movieExistsMiddleware = new DocumentExistsMiddleware(movieService, 'Movie', 'id');
    const authorizationMiddleware = new AuthorizeMiddleware();

    this.addRoute({path: '/', method: HttpMethod.Get, handler: this.getAll});

    this.addRoute({
      path: '/',
      method: HttpMethod.Post,
      handler: this.create,
      middlewares: [authorizationMiddleware, validateMovieDtoMiddleware]
    });

    this.addRoute({path: '/promo', method: HttpMethod.Get, handler: this.getPromo});

    this.addRoute({
      path: '/to-watch',
      method: HttpMethod.Get,
      handler: this.getToWatchList,
      middlewares: [authorizationMiddleware]
    });

    this.addRoute({
      path: '/to-watch',
      method: HttpMethod.Post,
      handler: this.addToToWatchList,
      middlewares: [authorizationMiddleware, validateMovieDtoMiddleware]
    });

    this.addRoute({
      path: '/to-watch',
      method: HttpMethod.Delete,
      handler: this.deleteFromToWatchList,
      middlewares: [authorizationMiddleware]
    });

    this.addRoute({
      path: '/:id/comments',
      method: HttpMethod.Get,
      handler: this.getComments,
      middlewares: [validateObjectIdMiddleware, movieExistsMiddleware]
    });

    this.addRoute({
      path: '/:id/comments',
      method: HttpMethod.Post,
      handler: this.createComment,
      middlewares: [authorizationMiddleware, validateObjectIdMiddleware, validateCommentDtoMiddleware, movieExistsMiddleware]
    });

    this.addRoute({
      path: '/:id',
      method: HttpMethod.Get,
      handler: this.getById,
      middlewares: [validateObjectIdMiddleware, movieExistsMiddleware]
    });

    this.addRoute({
      path: '/:id',
      method: HttpMethod.Put,
      handler: this.update,
      middlewares: [authorizationMiddleware, validateObjectIdMiddleware, validateMovieDtoMiddleware, movieExistsMiddleware]
    });

    this.addRoute({
      path: '/:id',
      method: HttpMethod.Delete,
      handler: this.deleteById,
      middlewares: [authorizationMiddleware, validateObjectIdMiddleware, movieExistsMiddleware]
    });
  }

  public async getAll(
    req: Request<Record<string, unknown>, Record<string, unknown>, Record<string, unknown>, {genre?: Genre, limit?: number}>,
    res: Response
  ): Promise<void> {
    const movies = req.query.genre
      ? await this.movieService.findByGenre(req.query.genre, req.query.limit)
      : await this.movieService.getAll(req.query.limit);
    this.ok(res, fillDto(MovieListItemResponse, movies));
  }

  public async getById(
    req: Request<{id: string}>,
    res: Response
  ): Promise<void> {
    const movie = await this.movieService.findById(req.params.id);
    if (!movie) {
      throw new HttpError(
        StatusCodes.NOT_FOUND,
        'Фильм не найден',
        'MovieController',
      );
    }
    this.ok(res, fillDto(MovieResponse, {...movie, rating: movie.rating}));
  }

  public async getPromo(
    _req: Request,
    res: Response
  ): Promise<void> {
    const movie = await this.movieService.findById(this.configService.get('PROMO_MOVIE_ID'));
    if (!movie) {
      throw new HttpError(
        StatusCodes.NOT_FOUND,
        'Фильм не найден',
        'MovieController',
      );
    }
    this.ok(res, fillDto(MovieResponse, {...movie, rating: movie.rating}));
  }

  public async create(
    req: Request<Record<string, unknown>, MovieResponse | ValidationError[], CreateMovieDto>,
    res: Response<MovieResponse | ValidationError[]>
  ): Promise<void> {
    const result = await this.movieService.create(req.user.id, req.body);
    this.created(res, fillDto(MovieResponse, {...result, rating: 0}));
  }

  public async update(
    req: Request<{id: string}, MovieResponse | ValidationError[], CreateMovieDto>,
    res: Response<MovieResponse | ValidationError[]>
  ): Promise<void> {
    const result = await this.movieService.update(req.params.id, req.user.id, req.body);
    if (!result) {
      throw new HttpError(
        StatusCodes.NOT_FOUND,
        'Фильм не найден',
        'MovieController',
      );
    }
    this.created(res, fillDto(MovieResponse, {...result, rating: result.rating}));
  }

  public async deleteById(
    req: Request<{id: string}>,
    res: Response
  ): Promise<void> {
    await this.movieService.deleteById(req.params.id);
    this.noContent(res);
  }

  public async getToWatchList(): Promise<void> {
    throw new HttpError(
      StatusCodes.NOT_IMPLEMENTED,
      'Метод не реализован',
      'MovieController',
    );
  }

  public async addToToWatchList(): Promise<void> {
    throw new HttpError(
      StatusCodes.NOT_IMPLEMENTED,
      'Метод не реализован',
      'MovieController',
    );
  }

  public async deleteFromToWatchList(): Promise<void> {
    throw new HttpError(
      StatusCodes.NOT_IMPLEMENTED,
      'Метод не реализован',
      'MovieController',
    );
  }

  public async getComments(
    req: Request<{id: string}>,
    res: Response
  ): Promise<void> {
    const comments = await this.commentService.findByMovieId(req.params.id);
    this.ok(res, fillDto(CommentDto, comments));
  }

  public async createComment(
    req: Request<{id: string}, CommentDto | ValidationError[], CreateCommentDto>,
    res: Response<CommentDto | ValidationError[]>
  ): Promise<void> {
    const comment = await this.commentService.create(req.params.id, req.user.id, req.body);
    if (!comment) {
      throw new HttpError(
        StatusCodes.NOT_FOUND,
        'Комментарий не найден',
        'MovieController',
      );
    }
    this.created(res, fillDto(CommentDto, comment));
  }
}
