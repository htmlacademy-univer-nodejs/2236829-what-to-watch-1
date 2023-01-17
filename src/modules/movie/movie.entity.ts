import typegoose, { getModelForClass, defaultClasses, Ref } from '@typegoose/typegoose';
import { Genre, GENRES } from '../../types/genre.type.js';
import { UserEntity } from '../user/user.entity.js';

const {prop, modelOptions} = typegoose;

export interface MovieEntity extends defaultClasses.Base {}

@modelOptions({
  schemaOptions: {
    collection: 'movies'
  }
})
export class MovieEntity extends defaultClasses.TimeStamps {
  @prop({
    trim: true,
    required: true,
    minlength: 2,
    maxlength: 100
  })
  public title!: string;

  @prop({
    trim: true,
    required: true,
    minlength: 20,
    maxlength: 1024
  })
  public description!: string;

  @prop({
    required: true,
    default: () => new Date()
  })
  public publicationDate!: Date;

  @prop({
    required: true,
    type: () => String,
    enum: GENRES
  })
  public genre!: Genre;

  @prop({ required: true, min: 0 })
  public releaseYear!: number;

  @prop({
    default: 0,
    min: 0
  })
  public ratingSum!: number;

  @prop({ required: true })
  public videoPreviewUri!: string;

  @prop({ required: true })
  public videoUri!: string;

  @prop({
    required: true,
    default: [],
    _id: false
  })
  public cast!: string[];

  @prop({
    required: true,
    minlength: 2,
    maxlength: 50
  })
  public producer!: string;

  @prop({ required: true, min: 0 })
  public duration!: number;

  @prop({
    default: 0,
    min: 0
  })
  public commentAmount!: number;

  @prop({
    ref: UserEntity,
    required: true
  })
  public user!: Ref<UserEntity>;

  @prop({ required: true })
  public posterUri!: string;

  @prop({ required: true })
  public backgroundImageUri!: string;

  @prop({ required: true })
  public backgroundColor!: string;
}

export const MovieModel = getModelForClass(MovieEntity);
