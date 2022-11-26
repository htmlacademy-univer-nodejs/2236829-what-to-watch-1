import typegoose, { getModelForClass, defaultClasses, Ref } from '@typegoose/typegoose';
import { MovieEntity } from '../movie/movie.entity.js';
import { UserEntity } from '../user/user.entity.js';

const { prop, modelOptions } = typegoose;

export interface ToWatchEntity extends defaultClasses.Base {}

@modelOptions({
  schemaOptions: {
    collection: 'to-watch'
  }
})
export class ToWatchEntity extends defaultClasses.TimeStamps {
  @prop({
    ref: UserEntity,
    required: true
  })
  public userId!: Ref<UserEntity>;

  @prop({
    ref: MovieEntity,
    required: true,
    default: [],
    _id: false
  })
  public list!: Ref<MovieEntity>[];
}

export const ToWatchModel = getModelForClass(ToWatchEntity);
