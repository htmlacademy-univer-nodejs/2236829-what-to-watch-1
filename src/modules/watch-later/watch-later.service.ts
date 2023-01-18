import { inject, injectable } from 'inversify';
import { WatchLaterEntity } from './watch-later.entity.js';
import { DocumentType, types } from '@typegoose/typegoose';
import { WatchLaterServiceInterface } from './watch-later-service.interface.js';
import { Component } from '../../types/component.type.js';

@injectable()
export default class WatchLaterService implements WatchLaterServiceInterface {
  constructor(
    @inject(Component.WatchLaterModel)
    private readonly WatchLaterModel: types.ModelType<WatchLaterEntity>
  ) {}

  public async getWatchLater(userId: string): Promise<DocumentType<WatchLaterEntity> | null> {
    const result = await this.WatchLaterModel.findOne({userId})
      .populate('list')
      .populate({path:'list', populate: {path: 'user'}})
      .exec();
    return result;
  }

  public async addToWatchLater(userId: string, movieId: string): Promise<void> {
    await this.WatchLaterModel.findOneAndUpdate({userId}, {$addToSet: {list: movieId}}, {upsert: true, new: true});
  }

  public async deleteFromWatchLater(userId: string, movieId: string): Promise<void> {
    await this.WatchLaterModel.findOneAndUpdate({userId}, {$pull: {list: movieId}}, {upsert: true, new: true});
  }
}
