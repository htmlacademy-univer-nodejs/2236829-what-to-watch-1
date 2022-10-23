import { User } from '../../types/user.type.js';
import typegoose, { getModelForClass, defaultClasses } from '@typegoose/typegoose';

const { prop } = typegoose;

export interface UserEntity extends defaultClasses.Base {}

export class UserEntity extends defaultClasses.TimeStamps implements User {
  @prop({
    unique: true,
    required: true,
    match: /^([\w-\\.]+@([\w-]+\.)+[\w-]{2,4})?$/
  })
  public email!: string;

  @prop()
  public avatarUri!: string;

  @prop({
    required: true,
    minlength: 1,
    maxlength: 15
  })
  public name!: string;

  @prop({ required: true })
  public password!: string;
}

export const UserModel = getModelForClass(UserEntity);
