import { IsMongoId } from 'class-validator';

export default class DeleteFromWatchLater {
  @IsMongoId({message: 'Поле movieId должно быть корректным id'})
  public movieId!: string;
}
