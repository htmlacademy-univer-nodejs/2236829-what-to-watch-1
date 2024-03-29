import { DocumentType } from '@typegoose/typegoose/lib/types.js';
import { CommentEntity } from './comment.entity.js';
import CreateCommentDto from './dto/create-comment.dto.js';

export interface CommentServiceInterface {
  create(movieId: string, userId: string, dto: CreateCommentDto): Promise<DocumentType<CommentEntity> | null>;
  findByMovieId(movieId: string): Promise<DocumentType<CommentEntity>[]>;
  deleteByMovieId(movieId: string): Promise<number>;
}
