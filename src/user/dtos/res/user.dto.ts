import { Prop } from '@nestjs/mongoose';
import { ObjectId } from 'mongoose';
import { User } from 'src/schemas/user.schema';

export class UserDto extends User {
  @Prop({
    unique: true,
  })
  _id: ObjectId;
}
