import { DocumentType } from '@typegoose/typegoose';
import CreateMovieDto from './dto/create-movie.dto.js';
import { MovieEntity } from './movie.entity.js';

export interface MovieServiceInterface {
  create(dto: CreateMovieDto): Promise<DocumentType<MovieEntity>>;
  findById(id: string): Promise<DocumentType<MovieEntity> | null>;
}
