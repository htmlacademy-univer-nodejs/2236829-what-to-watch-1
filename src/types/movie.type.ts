import { Genre } from './genre.type.js';
import { User } from './user.type.js';

export type Movie = {
  title: string;
  description: string;
  publicationDate: Date;
  genre: Genre;
  releaseYear: number;
  rating: number;
  videoPreviewUri: string;
  videoUri: string;
  cast: string[];
  producer: string;
  duration: number;
  commentAmount: number;
  user: User;
  posterUri: string;
  backgroundImageUri: string;
  backgroundColor: string;
};
