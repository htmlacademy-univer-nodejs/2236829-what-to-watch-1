import typegoose, { getModelForClass, defaultClasses, Ref } from '@typegoose/typegoose';
import { MovieEntity } from '../movie/movie.entity.js';
import { UserEntity } from '../user/user.entity.js';

const { prop, modelOptions } = typegoose;

export interface WatchLaterEntity extends defaultClasses.Base {}

@modelOptions({
  schemaOptions: {
    collection: 'watch-later'
  }
})
export class WatchLaterEntity extends defaultClasses.TimeStamps {
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

export const WatchLaterModel = getModelForClass(WatchLaterEntity);
