import { DocumentType } from '@typegoose/typegoose';
import { ToWatchEntity } from './to-watch.entity.js';
import { Populated } from '../../types/populated.type.js';

export interface ToWatchServiceInterface {
  getToWatch(userId: string): Promise<Populated<DocumentType<ToWatchEntity>, 'list'> | null>;
  addToToWatch(userId: string, movieId: string): Promise<DocumentType<ToWatchEntity>>;
  deleteFromToWatch(userId: string, movieId: string): Promise<void>;
}
