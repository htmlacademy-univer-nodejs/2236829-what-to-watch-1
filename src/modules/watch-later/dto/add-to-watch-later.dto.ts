import { IsMongoId } from 'class-validator';

export default class AddToWatchLater {
  @IsMongoId({message: 'Поле movieId должно быть корректным id'})
  public movieId!: string;
}
