import { Type } from 'class-transformer';
import UserDto from '../../user/dto/user.dto.js';

export default class CommentDto {
  public text!: string;
  public rating!: number;
  public date!: string;
  @Type(() => UserDto)
  public userId!: UserDto;
}
