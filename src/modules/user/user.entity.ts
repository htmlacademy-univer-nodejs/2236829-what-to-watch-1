import { User } from '../../types/user.type.js';
import typegoose, { getModelForClass, defaultClasses } from '@typegoose/typegoose';

const { prop } = typegoose;

export interface UserEntity extends defaultClasses.Base {}

export class UserEntity extends defaultClasses.TimeStamps implements User {
  constructor(data: User) {
    super();

    this.email = data.email;
    this.avatarUri = data.avatarUri;
    this.name = data.name;
    this.password = data.password;
  }

  @prop({
    unique: true,
    required: true,
    match: /^([\w-\\.]+@([\w-]+\.)+[\w-]{2,4})?$/
  })
  public email!: string;

  @prop({default: ''})
  public avatarUri: string;

  @prop({
    required: true,
    minlength: 1,
    maxlength: 15,
    default: ''
  })
  public name!: string;

  @prop({ required: true, default: '' })
  public password!: string;
}

export const UserModel = getModelForClass(UserEntity);
