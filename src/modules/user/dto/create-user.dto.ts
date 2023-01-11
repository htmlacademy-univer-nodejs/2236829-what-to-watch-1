import { IsEmail, MaxLength, MinLength } from 'class-validator';

export default class CreateUserDto {
  @MinLength(1, {message: 'Поле name не может иметь длину меньше 1'})
  @MaxLength(15, {message: 'Поле name не может иметь длину больше 15'})
  public name!: string;

  @IsEmail({}, {message: 'Значение поля email должно быть валидным адресом электронной почты'})
  public email!: string;

  @MinLength(6, {message: 'Поле password не может иметь длину меньше 6'})
  @MaxLength(12, {message: 'Поле password не может иметь длину больше 12'})
  public password!: string;
}
