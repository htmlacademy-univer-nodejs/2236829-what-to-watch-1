import { Type } from 'class-transformer';
import UserResponse from '../../user/response/user.response.js';

export default class CommentResponse {
  public text!: string;
  public rating!: number;
  public date!: string;
  @Type(() => UserResponse)
  public userId!: UserResponse;
}
