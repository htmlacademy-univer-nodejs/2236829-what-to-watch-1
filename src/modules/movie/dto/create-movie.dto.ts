import { IsArray, IsDateString, IsIn, IsInt, IsMongoId, MaxLength, MinLength, IsNumber, Min } from 'class-validator';
import { Genre, GENRES } from '../../../types/genre.type';

export default class CreateMovieDto {
  @MinLength(2, {message: 'Поле title не может иметь длину меньше 2'})
  @MaxLength(100, {message: 'Поле title не может иметь длину больше 100'})
  public title!: string;

  @MinLength(20, {message: 'Поле description не может иметь длину меньше 20'})
  @MaxLength(1024, {message: 'Поле description не может иметь длину больше 1024'})
  public description!: string;

  @IsDateString({}, {message: 'Поле publicationDate должно быть валидной датой ISO'})
  public publicationDate!: string;

  @IsIn(GENRES, {message: 'Поле genre должно иметь тип Genre'})
  public genre!: Genre;

  @IsInt({message: 'Поле releaseYear должно быть целым числом'})
  public releaseYear!: number;

  public videoPreviewUri!: string;

  public videoUri!: string;

  @IsArray({message: 'Поле cast должно быть массивом строк'})
  public cast!: string[];

  @MinLength(2, {message: 'Поле producer не может иметь длину меньше 2'})
  @MaxLength(50, {message: 'Поле producer не может иметь длину больше 50'})
  public producer!: string;

  @IsNumber({}, {message: 'Поле duration должно быть числом'})
  @Min(0, {message: 'Значения поля duration не может быть меньше 0'})
  public duration!: number;

  @IsMongoId({each: true, message: 'Поле userId должно быть корректным идентификатором'})
  public userId!: string;

  public posterUri!: string;

  public backgroundImageUri!: string;

  public backgroundColor!: string;
}
