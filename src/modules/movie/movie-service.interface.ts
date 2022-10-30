import { DocumentType } from '@typegoose/typegoose';
import CreateMovieDto from './dto/create-movie.dto.js';
import { MovieEntity } from './movie.entity.js';

export interface MovieServiceInterface {
  create(dto: CreateMovieDto, salt: string): Promise<DocumentType<MovieEntity>>;
  findById(email: string): Promise<DocumentType<MovieEntity> | null>;
}
