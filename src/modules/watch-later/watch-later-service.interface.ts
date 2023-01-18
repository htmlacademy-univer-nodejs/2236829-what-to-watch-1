import { DocumentType } from '@typegoose/typegoose';
import { WatchLaterEntity } from './watch-later.entity.js';

export interface WatchLaterServiceInterface {
  getWatchLater(userId: string): Promise<DocumentType<WatchLaterEntity> | null>;
  addToWatchLater(userId: string, movieId: string): Promise<void>;
  deleteFromWatchLater(userId: string, movieId: string): Promise<void>;
}
