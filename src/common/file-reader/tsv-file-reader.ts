import { readFileSync } from 'fs';
import { isGenre } from '../../types/genre.type.js';
import { Movie } from '../../types/movie.type.js';
import { FileReaderInterface } from './file-reader.interface.js';

export default class TSVFileReader implements FileReaderInterface {
  private rawData = '';

  constructor(public filename: string) {}

  public read(): void {
    this.rawData = readFileSync(this.filename, { encoding: 'utf8' });
  }

  public toArray(): Movie[] {
    if (!this.rawData) {
      return [];
    }

    return this.rawData
      .split('\n')
      .filter((row) => row.trim() !== '')
      .map((line) => line.split('\t'))
      .map(
        ([
          title,
          description,
          publicationDate,
          genre,
          releaseYear,
          rating,
          videoPreviewUri,
          videoUri,
          cast,
          producer,
          duration,
          commentAmount,
          userName,
          userAvatarUri,
          userEmail,
          userPassword,
          posterUri,
          backgroundImageUri,
          backgroundColor,
        ]) => {
          if (!isGenre(genre)) {
            throw new Error('Параметр genre должен иметь тип Genre');
          }
          return {
            title,
            description,
            publicationDate,
            genre: genre,
            releaseYear: parseInt(releaseYear, 10),
            rating: parseFloat(rating),
            videoPreviewUri,
            videoUri,
            cast: cast.split(';'),
            producer,
            duration: parseInt(duration, 10),
            commentAmount: parseInt(commentAmount, 10),
            user: {
              name: userName,
              avatarUri: userAvatarUri,
              email: userEmail,
              password: userPassword,
            },
            posterUri,
            backgroundImageUri,
            backgroundColor,
          };
        }
      );
  }
}
