import { isGenre } from "../types/genre.type.js";
import { Movie } from "../types/movie.type.js";

export function createMovie(str: string): Movie {
  const [
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
  ] = str.split('\t');

  if (typeof backgroundColor === 'undefined') {
    throw new Error('Строка содержит недостаточно значений');
  }

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
    cast: cast.split(','),
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