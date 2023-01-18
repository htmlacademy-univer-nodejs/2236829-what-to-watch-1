import { MockData } from '../../types/mock-data.type.js';
import { getRandomItem, getRandomSlice } from '../../utils/random.js';
import { MovieGeneratorInterface } from './movie-generator.interface.js';

export default class MovieGenerator implements MovieGeneratorInterface {
  constructor(private readonly mockData: MockData) {}

  public generate(): string {
    const title = getRandomItem(this.mockData.titles);
    const description = getRandomItem(this.mockData.descriptions);
    const publicationDate = getRandomItem(this.mockData.publicationDates);
    const genre = getRandomItem(this.mockData.genres);
    const releaseYear = getRandomItem(this.mockData.releaseYears);
    const videoPreviewUri = getRandomItem(this.mockData.videoPreviewUris);
    const videoUri = getRandomItem(this.mockData.videoUris);
    const cast = getRandomSlice(this.mockData.casts).join(',');
    const producer = getRandomItem(this.mockData.producers);
    const duration = getRandomItem(this.mockData.durations);
    const userName = getRandomItem(this.mockData.userNames);
    const userAvatarUri = getRandomItem(this.mockData.userAvatarUris);
    const userEmail = getRandomItem(this.mockData.userEmails);
    const posterUri = getRandomItem(this.mockData.posterUris);
    const backgroundImageUri = getRandomItem(this.mockData.backgroundImageUris);
    const backgroundColor = getRandomItem(this.mockData.backgroundColors);

    return [
      title,
      description,
      publicationDate,
      genre,
      releaseYear,
      videoPreviewUri,
      videoUri,
      cast,
      producer,
      duration,
      userName,
      userAvatarUri,
      userEmail,
      posterUri,
      backgroundImageUri,
      backgroundColor,
    ].join('\t');
  }
}
