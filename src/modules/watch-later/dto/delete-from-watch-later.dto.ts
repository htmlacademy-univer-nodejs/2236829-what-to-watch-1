import { IsMongoId } from 'class-validator';

export default class DeleteFromWatchLater {
  @IsMongoId({message: 'Поле title не может иметь длину меньше 2'})
  public movieId!: string;
}
