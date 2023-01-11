import { IsDateString, IsString, Max, Min } from 'class-validator';

export default class CreateCommentDto {
  @IsString({message: 'Поле text должно быть строкой'})
  public text!: string;

  @Min(0, {message: 'Значение поля rating не может быть меньше 0'})
  @Max(10, {message: 'Значение поля rating не может быть больше 10'})
  public rating!: number;

  @IsDateString({}, {message: 'Поле date должно быть валидной датой ISO'})
  public date!: Date;
}
