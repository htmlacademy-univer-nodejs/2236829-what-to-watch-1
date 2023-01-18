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
import UpdateMovieDto from './dto/update-movie.dto.js';
import { Genre } from '../../types/genre.type.js';
import MovieResponse from './response/movie.response.js';
import { ConfigInterface } from '../../common/config/config.interface.js';
import HttpError from '../../common/errors/http-error.js';
import { StatusCodes } from 'http-status-codes';
import CreateCommentDto from '../comment/dto/create-comment.dto.js';
import CommentResponse from '../comment/response/comment.response.js';
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
    const validateCreateMovieDtoMiddleware = new ValidateDtoMiddleware(CreateMovieDto);
    const validateUpdateMovieDtoMiddleware = new ValidateDtoMiddleware(UpdateMovieDto);
    const movieExistsMiddleware = new DocumentExistsMiddleware(movieService, 'Movie', 'id');
    const authorizationMiddleware = new AuthorizeMiddleware();

    this.addRoute({path: '/', method: HttpMethod.Get, handler: this.getAll});

    this.addRoute({
      path: '/',
      method: HttpMethod.Post,
      handler: this.create,
      middlewares: [authorizationMiddleware, validateCreateMovieDtoMiddleware]
    });

    this.addRoute({path: '/promo', method: HttpMethod.Get, handler: this.getPromo});

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
      middlewares: [authorizationMiddleware, validateObjectIdMiddleware, movieExistsMiddleware, validateCommentDtoMiddleware]
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
      middlewares: [authorizationMiddleware, validateObjectIdMiddleware, movieExistsMiddleware, validateUpdateMovieDtoMiddleware]
    });

    this.addRoute({
      path: '/:id',
      method: HttpMethod.Delete,
      handler: this.delete,
      middlewares: [authorizationMiddleware, validateObjectIdMiddleware, movieExistsMiddleware]
    });
  }

  public async getAll(
    req: Request<Record<string, unknown>, MovieListItemResponse[], Record<string, unknown>, {genre?: Genre, limit?: string}>,
    res: Response<MovieListItemResponse[]>
  ): Promise<void> {
    const limit = parseInt(req.query.limit ?? '60', 10);
    if (limit < 0) {
      throw new HttpError(
        StatusCodes.BAD_REQUEST,
        'Запрошено невалидное количество фильмов',
        'MovieController'
      );
    }
    const movies = req.query.genre
      ? await this.movieService.findByGenre(req.query.genre, limit)
      : await this.movieService.getAll(limit);
    this.ok(res, fillDto(MovieListItemResponse, movies));
  }

  public async getById(
    req: Request<{id: string}, MovieResponse>,
    res: Response<MovieResponse>
  ): Promise<void> {
    const movie = await this.movieService.findById(req.params.id);
    this.ok(res, fillDto(MovieResponse, movie));
  }

  public async getPromo(
    _req: Request<Record<string, unknown>, MovieResponse>,
    res: Response<MovieResponse>
  ): Promise<void> {
    const movie = await this.movieService.getAll(1);
    if (!movie) {
      throw new HttpError(
        StatusCodes.NOT_FOUND,
        'Фильм не найден',
        'MovieController',
      );
    }
    this.ok(res, fillDto(MovieResponse, movie[0]));
  }

  public async create(
    req: Request<Record<string, unknown>, MovieResponse | ValidationError[], CreateMovieDto>,
    res: Response<MovieResponse | ValidationError[]>
  ): Promise<void> {
    const existingMovie = await this.movieService.findByTitle(req.body.title);

    if (existingMovie) {
      throw new HttpError(
        StatusCodes.CONFLICT,
        `Фильм «${req.body.title}» уже существует`,
        'MovieController',
      );
    }

    const result = await this.movieService.create(req.user.id, req.body);
    this.created(res, fillDto(MovieResponse, result));
  }

  public async update(
    req: Request<{id: string}, MovieResponse | ValidationError[], UpdateMovieDto>,
    res: Response<MovieResponse | ValidationError[]>
  ): Promise<void> {
    const existingMovie = await this.movieService.findById(req.params.id);

    if (existingMovie?.user?.id !== req.user.id) {
      throw new HttpError(
        StatusCodes.FORBIDDEN,
        `Фильм «${req.body.title}» не принадлежит текущему пользователю`,
        'MovieController',
      );
    }

    const result = await this.movieService.update(req.params.id, req.body);
    this.created(res, fillDto(MovieResponse, result));
  }

  public async delete(
    req: Request<{id: string}>,
    res: Response
  ): Promise<void> {
    const existingMovie = await this.movieService.findById(req.params.id);
    if (existingMovie?.user?.id !== req.user.id) {
      throw new HttpError(
        StatusCodes.FORBIDDEN,
        `Фильм «${req.body.title}» не принадлежит текущему пользователю`,
        'MovieController',
      );
    }
    await this.movieService.deleteById(req.params.id);
    await this.commentService.deleteByMovieId(req.params.id);
    this.noContent(res);
  }

  public async getComments(
    req: Request<{id: string}, CommentResponse[]>,
    res: Response<CommentResponse[]>
  ): Promise<void> {
    const comments = await this.commentService.findByMovieId(req.params.id);
    this.ok(res, fillDto(CommentResponse, comments));
  }

  public async createComment(
    req: Request<{id: string}, CommentResponse | ValidationError[], CreateCommentDto>,
    res: Response<CommentResponse | ValidationError[]>
  ): Promise<void> {
    const comment = await this.commentService.create(req.params.id, req.user.id, req.body);
    this.created(res, fillDto(CommentResponse, comment));
  }
}
