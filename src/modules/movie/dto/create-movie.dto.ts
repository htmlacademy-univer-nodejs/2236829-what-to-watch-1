import { Genre } from '../../../types/genre.type';

export default class CreateMovieDto {
  public title!: string;
  public description!: string;
  public publicationDate!: string;
  public genre!: Genre;
  public releaseYear!: number;
  public rating!: number;
  public videoPreviewUri!: string;
  public videoUri!: string;
  public cast!: string[];
  public producer!: string;
  public duration!: number;
  public commentAmount!: number;
  public userId!: string;
  public posterUri!: string;
  public backgroundImageUri!: string;
  public backgroundColor!: string;
}
