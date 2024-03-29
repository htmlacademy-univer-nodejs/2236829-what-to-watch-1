import { Expose } from 'class-transformer';

export default class UserResponse {
  @Expose()
  public id!: string;

  @Expose()
  public name!: string;

  @Expose()
  public avatarUri!: string;

  @Expose()
  public email!: string;
}
