import { inject, injectable } from 'inversify';
import { MovieEntity } from './movie.entity.js';
import { DocumentType, types } from '@typegoose/typegoose';
import CreateMovieDto from './dto/create-movie.dto.js';
import UpdateMovieDto from './dto/update-movie.dto.js';
import { MovieServiceInterface } from './movie-service.interface.js';
import { LoggerInterface } from '../../common/logger/logger.interface.js';
import { Component } from '../../types/component.type.js';
import { isNullOrUndefined } from '@typegoose/typegoose/lib/internal/utils.js';
import { Genre } from '../../types/genre.type.js';

@injectable()
export default class MovieService implements MovieServiceInterface {
  constructor(
    @inject(Component.LoggerInterface)
    private logger: LoggerInterface,
    @inject(Component.MovieModel)
    private readonly movieModel: types.ModelType<MovieEntity>
  ) {}

  public async create(userId: string, dto: CreateMovieDto): Promise<DocumentType<MovieEntity>> {
    const result = await (await this.movieModel.create({...dto, user: userId})).populate('user');
    this.logger.info(`Создан фильм: ${dto.title}`);

    return result;
  }

  public async update(id: string, dto: UpdateMovieDto): Promise<DocumentType<MovieEntity> | null> {
    const movie = await this.findById(id);
    if (!movie) {
      this.logger.info(`Фильм не был изменён, так как не существует: ${dto.title}`);
      return null;
    }

    const result = await this.movieModel.findOneAndReplace({_id: id}, {...dto, user: movie.user}, {new: true}).populate('user');
    this.logger.info(`Изменён фильм: ${movie.title} → ${dto.title}`);

    return result;
  }

  public async deleteById(id: string): Promise<boolean> {
    return ((await this.movieModel.deleteOne({_id: id})).deletedCount ?? 0) > 0;
  }

  public async findById(id: string): Promise<DocumentType<MovieEntity> | null> {
    return await this.movieModel.findById(id).populate('user');
  }

  public async findByTitle(title: string): Promise<DocumentType<MovieEntity> | null> {
    return await this.movieModel.findOne({title}).populate('user');
  }

  public async getAll(limit? : number): Promise<DocumentType<MovieEntity>[]> {
    let query = this.movieModel.find().sort({publicationDate: 'desc'}).populate('user');
    if (!isNullOrUndefined(limit)) {
      query = query.limit(limit);
    }
    return await query;
  }

  public async findByGenre(genre: Genre, limit?: number): Promise<DocumentType<MovieEntity>[]> {
    let query = this.movieModel.find({genre}).sort({publicationDate: 'desc'}).populate('user');
    if (!isNullOrUndefined(limit)) {
      query = query.limit(limit);
    }
    return await query;
  }

  public async exists(documentId: string): Promise<boolean> {
    return (await this.movieModel.exists({_id: documentId})) !== null;
  }
}
