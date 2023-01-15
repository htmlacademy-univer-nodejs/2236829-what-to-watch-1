import { Genre } from '../../../types/genre.type';

export default class MovieListItemResponse {
  public title!: string;
  public publicationDate!: Date;
  public genre!: Genre;
  public videoPreviewUri!: string;
  public userId!: string;
  public posterUri!: string;
  public commentAmount!: number;
}
