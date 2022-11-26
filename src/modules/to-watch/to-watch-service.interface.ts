import { DocumentType } from '@typegoose/typegoose';
import { ToWatchEntity } from './to-watch.entity.js';

export interface ToWatchServiceInterface {
  getToWatch(userId: string): Promise<DocumentType<ToWatchEntity>[]>;
  addToToWatch(userId: string, movieId: string): Promise<DocumentType<ToWatchEntity>>;
  deleteFromToWatch(userId: string, movieId: string): Promise<void>;
}
