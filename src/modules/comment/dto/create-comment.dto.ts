import { IsDateString, Max, MaxLength, Min, MinLength } from 'class-validator';

export default class CreateCommentDto {
  @MinLength(5, {message: 'Поле text не может иметь длину меньше 5'})
  @MaxLength(1024, {message: 'Поле text не может иметь длину больше 1024'})
  public text!: string;

  @Min(0, {message: 'Значение поля rating не может быть меньше 0'})
  @Max(10, {message: 'Значение поля rating не может быть больше 10'})
  public rating!: number;

  @IsDateString({}, {message: 'Поле date должно быть валидной датой ISO'})
  public date: Date = new Date();
}
