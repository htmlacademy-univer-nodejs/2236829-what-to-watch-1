import { DocumentType } from '@typegoose/typegoose';
import { WatchLaterEntity } from './watch-later.entity.js';
import { Populated } from '../../types/populated.type.js';

export interface WatchLaterServiceInterface {
  getWatchLater(userId: string): Promise<Populated<DocumentType<WatchLaterEntity>, 'list'> | null>;
  addToWatchLater(userId: string, movieId: string): Promise<DocumentType<WatchLaterEntity>>;
  deleteFromWatchLater(userId: string, movieId: string): Promise<void>;
}
