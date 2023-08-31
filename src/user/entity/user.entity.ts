import { Prop } from '@nestjs/mongoose';
import { Exclude, Expose } from 'class-transformer';
import { Types } from 'mongoose';

export class UserEntity {
  @Prop({ type: Types.ObjectId, auto: true, unique: true })
  @Expose()
  _id: Types.ObjectId;

  @Prop()
  @Expose()
  email: string;

  @Prop()
  @Exclude()
  password: string;

  @Prop()
  @Expose()
  nickname: string;
}
