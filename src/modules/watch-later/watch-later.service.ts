import { inject, injectable } from 'inversify';
import { WatchLaterEntity } from './watch-later.entity.js';
import { DocumentType, types } from '@typegoose/typegoose';
import { WatchLaterServiceInterface } from './watch-later-service.interface.js';
import { Component } from '../../types/component.type.js';
import { Populated } from '../../types/populated.type.js';
import { MovieEntity } from '../movie/movie.entity.js';

@injectable()
export default class WatchLaterService implements WatchLaterServiceInterface {
  constructor(
    @inject(Component.WatchLaterModel)
    private readonly WatchLaterModel: types.ModelType<WatchLaterEntity>
  ) {}

  public async getWatchLater(userId: string): Promise<Populated<DocumentType<WatchLaterEntity>, 'list'> | null> {
    const result = await this.WatchLaterModel.findOne({userId}).populate<{list: DocumentType<MovieEntity>[]}>('list').exec();
    return result;
  }

  public async addToWatchLater(userId: string, movieId: string): Promise<DocumentType<WatchLaterEntity>> {
    const result = await this.WatchLaterModel.findByIdAndUpdate(userId, {$addToSet: {list: movieId}}, {upsert: true, new: true});
    return result;
  }

  public async deleteFromWatchLater(userId: string, movieId: string): Promise<void> {
    await this.WatchLaterModel.findByIdAndUpdate(userId, {$pull: {list: movieId}}, {upsert: true, new: true});
  }
}
