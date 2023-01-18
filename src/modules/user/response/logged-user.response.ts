import { Expose } from 'class-transformer';

export default class LoggedUserResponse {
  @Expose()
  public id!: string;

  @Expose()
  public token!: string;

  @Expose()
  public name!: string;

  @Expose()
  public avatarUri!: string;

  @Expose()
  public email!: string;
}
