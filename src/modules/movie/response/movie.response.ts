import { Expose, Type } from 'class-transformer';
import { Genre } from '../../../types/genre.type';
import UserResponse from '../../user/response/user.response';

export default class MovieResponse {
  @Expose()
  public title!: string;

  @Expose()
  public description!: string;

  @Expose()
  public publicationDate!: Date;

  @Expose()
  public genre!: Genre;

  @Expose()
  public releaseYear!: number;

  @Expose()
  public videoPreviewUri!: string;

  @Expose()
  public videoUri!: string;

  @Expose()
  public cast!: string[];

  @Expose()
  public producer!: string;

  @Expose()
  public duration!: number;

  @Expose()
  @Type(() => UserResponse)
  public user!: UserResponse;

  @Expose()
  public posterUri!: string;

  @Expose()
  public backgroundImageUri!: string;

  @Expose()
  public backgroundColor!: string;

  @Expose()
  public rating!: number;
}
