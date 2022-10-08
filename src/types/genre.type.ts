const GENRES = ['comedy', 'crime', 'documentary', 'drama', 'horror', 'family', 'romance', 'scifi', 'thriller'];

export type Genre = typeof GENRES[number];

export function isGenre(genre: string): genre is Genre {
  return GENRES.includes(genre);
}
