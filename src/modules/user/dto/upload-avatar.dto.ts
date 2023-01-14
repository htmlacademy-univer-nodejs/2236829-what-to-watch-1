import { Expose } from 'class-transformer';

export default class UploadAvatarDto {
  @Expose()
  public avatarUri!: string;
}
