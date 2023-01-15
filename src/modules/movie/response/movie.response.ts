import { Transform } from 'class-transformer';
import { Genre } from '../../../types/genre.type';

export default class MovieResponse {
  public title!: string;
  public description!: string;
  public publicationDate!: Date;
  public genre!: Genre;
  public releaseYear!: number;
  public videoPreviewUri!: string;
  public videoUri!: string;
  public cast!: string[];
  public producer!: string;
  public duration!: number;
  public userId!: string;
  public posterUri!: string;
  public backgroundImageUri!: string;
  public backgroundColor!: string;

  @Transform(({obj}) => obj.ratingSum / obj.commentAmount)
  public rating!: number;
}
