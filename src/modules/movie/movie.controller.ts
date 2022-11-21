import { Request, Response } from 'express';
import { inject, injectable } from 'inversify';
import { Controller } from '../../common/controller/controller.js';
import { Component } from '../../types/component.type.js';
import { LoggerInterface } from '../../common/logger/logger.interface.js';
import { HttpMethod } from '../../types/http-method.enum.js';
import { MovieServiceInterface } from './movie-service.interface.js';
import MovieListItemDto from './dto/movie-list-item.dto.js';
import { fillDto } from '../../utils/common.js';
import CreateMovieDto from './dto/create-movie.dto.js';
import { Genre } from '../../types/genre.type.js';
import MovieDto from './dto/movie.dto.js';
import { ConfigInterface } from '../../common/config/config.interface.js';

@injectable()
export default class MovieController extends Controller {
  constructor(
    @inject(Component.LoggerInterface)
    logger: LoggerInterface,
    @inject(Component.MovieServiceInterface)
    private readonly movieService: MovieServiceInterface,
    @inject(Component.ConfigInterface)
    private readonly configService: ConfigInterface,
  ) {
    super(logger);

    this.logger.info('Регистрация эндпоинтов для MovieController…');

    this.addRoute({path: '/', method: HttpMethod.Get, handler: this.getAll});
    this.addRoute({path: '/promo', method: HttpMethod.Get, handler: this.getPromo});
    this.addRoute({path: '/:id', method: HttpMethod.Get, handler: this.getById});
    this.addRoute({path: '/', method: HttpMethod.Post, handler: this.create});
    this.addRoute({path: '/:id', method: HttpMethod.Put, handler: this.update});
    this.addRoute({path: '/:id', method: HttpMethod.Delete, handler: this.deleteById});
  }

  public async getAll(
    req: Request<Record<string, unknown>, Record<string, unknown>, Record<string, unknown>, {genre?: Genre, limit?: number}>,
    res: Response
  ): Promise<void> {
    const movies = req.query.genre
      ? await this.movieService.findByGenre(req.query.genre, req.query.limit)
      : await this.movieService.getAll(req.query.limit);
    this.ok(res, fillDto(MovieListItemDto, movies));
  }

  public async getById(
    req: Request<{id: string}>,
    res: Response
  ): Promise<void> {
    const movie = await this.movieService.findById(req.params.id);
    this.ok(res, fillDto(MovieDto, movie));
  }

  public async getPromo(
    _req: Request,
    res: Response
  ): Promise<void> {
    const movie = await this.movieService.findById(this.configService.get('PROMO_MOVIE_ID'));
    this.ok(res, fillDto(MovieDto, movie));
  }

  public async create(
    req: Request<Record<string, unknown>, Record<string, unknown>, CreateMovieDto>,
    res: Response
  ): Promise<void> {
    const result = await this.movieService.create(req.body);
    this.created(res, fillDto(MovieDto, result));
  }

  public async update(
    req: Request<{id: string}, Record<string, unknown>, CreateMovieDto>,
    res: Response
  ): Promise<void> {
    const result = await this.movieService.update(req.params.id, req.body);
    this.created(res, fillDto(MovieDto, result));
  }

  public async deleteById(
    req: Request<{id: string}>,
    res: Response
  ): Promise<void> {
    await this.movieService.deleteById(req.params.id);
    this.noContent(res);
  }
}
