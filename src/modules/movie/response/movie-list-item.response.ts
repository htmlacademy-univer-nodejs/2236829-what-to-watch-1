import { Expose, Type } from 'class-transformer';
import { Genre } from '../../../types/genre.type.js';
import UserResponse from '../../user/response/user.response.js';

export default class MovieListItemResponse {
  @Expose()
  public title!: string;

  @Expose()
  public publicationDate!: Date;

  @Expose()
  public genre!: Genre;

  @Expose()
  public videoPreviewUri!: string;

  @Expose()
  @Type(() => UserResponse)
  public user!: UserResponse;

  @Expose()
  public posterUri!: string;

  @Expose()
  public commentAmount!: number;
}
