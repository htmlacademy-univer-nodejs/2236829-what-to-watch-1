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

  public async findById(id: string): Promise<DocumentType<MovieEntity> | null> {
    return this.movieModel.findOne({_id: id});
  }
}
