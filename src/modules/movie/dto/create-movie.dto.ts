import { IsArray, IsDateString, IsIn, IsInt, MaxLength, MinLength, IsNumber, Min, IsString } from 'class-validator';
import { Genre, GENRES } from '../../../types/genre.type';

export default class CreateMovieDto {
  @MinLength(2, {message: 'Поле title не может иметь длину меньше 2'})
  @MaxLength(100, {message: 'Поле title не может иметь длину больше 100'})
  public title!: string;

  @MinLength(20, {message: 'Поле description не может иметь длину меньше 20'})
  @MaxLength(1024, {message: 'Поле description не может иметь длину больше 1024'})
  public description!: string;

  @IsDateString({}, {message: 'Поле publicationDate должно быть валидной датой ISO'})
  public publicationDate!: Date;

  @IsIn(GENRES, {message: 'Поле genre должно иметь тип Genre'})
  public genre!: Genre;

  @IsInt({message: 'Поле releaseYear должно быть целым числом'})
  public releaseYear!: number;

  @IsString({message: 'Поле videoPreviewUri должно быть строкой'})
  public videoPreviewUri!: string;

  @IsString({message: 'Поле videoUri должно быть строкой'})
  public videoUri!: string;

  @IsArray({message: 'Поле cast должно быть массивом строк'})
  public cast!: string[];

  @MinLength(2, {message: 'Поле producer не может иметь длину меньше 2'})
  @MaxLength(50, {message: 'Поле producer не может иметь длину больше 50'})
  public producer!: string;

  @IsNumber({}, {message: 'Поле duration должно быть числом'})
  @Min(0, {message: 'Значения поля duration не может быть меньше 0'})
  public duration!: number;

  @IsString({message: 'Поле posterUri должно быть строкой'})
  public posterUri!: string;

  @IsString({message: 'Поле backgroundImageUri должно быть строкой'})
  public backgroundImageUri!: string;

  @IsString({message: 'Поле backgroundColor должно быть строкой'})
  public backgroundColor!: string;
}
