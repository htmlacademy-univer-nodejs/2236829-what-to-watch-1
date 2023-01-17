import typegoose, { getModelForClass, defaultClasses, Ref } from '@typegoose/typegoose';
import { Genre, GENRES } from '../../types/genre.type.js';
import { UserEntity } from '../user/user.entity.js';

const { prop, modelOptions } = typegoose;

export interface MovieEntity extends defaultClasses.Base {}

@modelOptions({
  schemaOptions: {
    collection: 'movies'
  }
})
export class MovieEntity extends defaultClasses.TimeStamps {
  @prop({
    required: true,
    minlength: 2,
    maxlength: 100,
    default: ''
  })
  public title!: string;

  @prop({
    required: true,
    minlength: 20,
    maxlength: 1024,
    default: ''
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
    required: true,
    default: 0,
    min: 0,
    max: 10
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
    maxlength: 50,
    default: ''
  })
  public producer!: string;

  @prop({ required: true, min: 0 })
  public duration!: number;

  @prop({
    required: true,
    default: 0,
    min: 0
  })
  public commentAmount!: number;

  @prop({
    ref: UserEntity,
    required: true
  })
  public user!: Ref<UserEntity>;

  @prop({
    required: true,
    match: /^\S+\.jpg$/
  })
  public posterUri!: string;

  @prop({
    required: true,
    match: /^\S+\.jpg$/
  })
  public backgroundImageUri!: string;

  @prop({ required: true })
  public backgroundColor!: string;
}

export const MovieModel = getModelForClass(MovieEntity);
