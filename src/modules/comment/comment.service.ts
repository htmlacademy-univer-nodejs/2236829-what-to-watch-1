import { inject, injectable } from 'inversify';
import { DocumentType, types } from '@typegoose/typegoose';
import { CommentServiceInterface } from './comment-service.interface.js';
import { Component } from '../../types/component.type.js';
import { CommentEntity } from './comment.entity.js';
import CreateCommentDto from './dto/create-comment.dto.js';
import { MovieEntity } from '../movie/movie.entity.js';

@injectable()
export default class CommentService implements CommentServiceInterface {
  constructor(
    @inject(Component.CommentModel)
    private readonly commentModel: types.ModelType<CommentEntity>,
    @inject(Component.MovieModel)
    private readonly movieModel: types.ModelType<MovieEntity>,
  ) {}

  public async create(movieId: string, userId: string, dto: CreateCommentDto): Promise<DocumentType<CommentEntity> | null> {
    const movie = await this.movieModel.findByIdAndUpdate(movieId, {$inc: {ratingSum: dto.rating, commentAmount: 1}});
    if (!movie) {
      return null;
    }
    const comment = await this.commentModel.create({movieId, user: userId, ...dto});
    return comment.populate('user');
  }

  public async findByMovieId(movieId: string): Promise<DocumentType<CommentEntity>[]> {
    return this.commentModel
      .find({movieId})
      .populate('user');
  }

  public async deleteByMovieId(movieId: string): Promise<number> {
    const result = await this.commentModel
      .deleteMany({movieId})
      .exec();

    return result.deletedCount;
  }
}
