import { inject, injectable } from 'inversify';
import { ToWatchEntity } from './to-watch.entity.js';
import { DocumentType, types } from '@typegoose/typegoose';
import { ToWatchServiceInterface } from './to-watch-service.interface.js';
import { Component } from '../../types/component.type.js';
import { Populated } from '../../types/populated.type.js';

@injectable()
export default class ToWatchService implements ToWatchServiceInterface {
  constructor(
    @inject(Component.ToWatchModel)
    private readonly toWatchModel: types.ModelType<ToWatchEntity>
  ) {}

  public async getToWatch(userId: string): Promise<Populated<DocumentType<ToWatchEntity>, 'list'> | null> {
    const result = await this.toWatchModel.findOne({userId}).populate('list').exec();
    return result as Populated<typeof result, 'list'>;
  }

  public async addToToWatch(userId: string, movieId: string): Promise<DocumentType<ToWatchEntity>> {
    const result = await this.toWatchModel.findByIdAndUpdate(userId, {$addToSet: {list: movieId}}, {upsert: true, new: true});
    return result;
  }

  public async deleteFromToWatch(userId: string, movieId: string): Promise<void> {
    await this.toWatchModel.findByIdAndUpdate(userId, {$pull: {list: movieId}}, {upsert: true, new: true});
  }
}
