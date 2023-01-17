import { User } from '../../types/user.type.js';
import typegoose, { getModelForClass, defaultClasses } from '@typegoose/typegoose';
import { createSHA256 } from '../../utils/common.js';

const { prop, modelOptions } = typegoose;

export interface UserEntity extends defaultClasses.Base {}

@modelOptions({
  schemaOptions: {
    collection: 'users'
  }
})
export class UserEntity extends defaultClasses.TimeStamps implements User {
  constructor(data: User) {
    super();

    this.email = data.email;
    this.avatarUri = data.avatarUri;
    this.name = data.name;
  }

  @prop({ unique: true, required: true })
  public email!: string;

  @prop({ required: true })
  public avatarUri!: string;

  @prop({
    required: true,
    minlength: 1,
    maxlength: 15
  })
  public name!: string;

  @prop({ required: true })
  private password!: string;

  public setPassword(password: string, salt: string) {
    if (password.length < 6 || password.length > 12) {
      throw new Error('Длина пароля должна быть не менее 6 и не более 12 символов');
    }
    this.password = createSHA256(password, salt);
  }

  public getPassword() {
    return this.password;
  }

  public verifyPassword(password: string, salt: string) {
    const hashPassword = createSHA256(password, salt);
    return hashPassword === this.password;
  }
}

export const UserModel = getModelForClass(UserEntity);
