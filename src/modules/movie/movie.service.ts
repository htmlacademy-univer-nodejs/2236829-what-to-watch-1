import { inject, injectable } from 'inversify';
import { MovieEntity } from './movie.entity.js';
import { DocumentType, types } from '@typegoose/typegoose';
import CreateMovieDto from './dto/create-movie.dto.js';
import { MovieServiceInterface } from './movie-service.interface.js';
import { LoggerInterface } from '../../common/logger/logger.interface.js';
import { Component } from '../../types/component.type.js';

@injectable()
export default class MovieService implements MovieServiceInterface {
  constructor(
    @inject(Component.LoggerInterface)
    private logger: LoggerInterface,
    @inject(Component.MovieModel)
    private readonly movieModel: types.ModelType<MovieEntity>
  ) {}

  public async create(dto: CreateMovieDto): Promise<DocumentType<MovieEntity>> {
    const result = await this.movieModel.create(dto);
    this.logger.info(`Создан фильм: ${dto.title}`);

    return result;
  }

  public async update(id: string, dto: CreateMovieDto): Promise<DocumentType<MovieEntity> | null> {
    const movie = await this.findById(id);
    if (!movie) {
      this.logger.info(`Фильм не был изменён, так как не существует: ${dto.title}`);
      return null;
    }
    if (movie.userId?.toString() !== dto.userId) {
      this.logger.info(`Фильм не был изменён, так как не принадлежит пользователю: ${movie.title}, ${dto.userId}`);
      return null;
    }

    const result = await this.movieModel.replaceOne({_id: id}, dto);
    this.logger.info(`Изменён фильм: ${movie.title} → ${dto.title}`);

    return result;
  }

  public async findById(id: string): Promise<DocumentType<MovieEntity> | null> {
    return this.movieModel.findOne({_id: id});
  }
}
