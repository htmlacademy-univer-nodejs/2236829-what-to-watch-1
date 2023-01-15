import { DocumentType } from '@typegoose/typegoose';
import { Genre } from '../../types/genre.type.js';
import CreateMovieDto from './dto/create-movie.dto.js';
import UpdateMovieDto from './dto/update-movie.dto.js';
import { MovieEntity } from './movie.entity.js';
import { DocumentExistsInterface } from '../../types/document-exists.interface.js';

export interface MovieServiceInterface extends DocumentExistsInterface<string> {
  create(userId: string, dto: CreateMovieDto): Promise<DocumentType<MovieEntity>>;
  findById(id: string): Promise<DocumentType<MovieEntity> | null>;
  getAll(limit? : number): Promise<DocumentType<MovieEntity>[]>;
  findByGenre(genre: Genre, limit? : number): Promise<DocumentType<MovieEntity>[]>;
  update(id: string, userId: string, dto: UpdateMovieDto): Promise<DocumentType<MovieEntity> | null>;
  deleteById(id: string): Promise<boolean>;
}
