import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export enum SignUpUserTypes {
  CANDIDATE = 'candidate',
  COMNPANY = 'company',
}

export enum UserTypes {
  ADMIN = 'admin',
  CANDIDATE = 'candidate',
  COMNPANY = 'company',
}

@Schema({
  timestamps: true,
})
export class User {
  @Prop()
  name: string;

  @Prop({ unique: [true, 'email in use'] })
  email: string;

  @Prop()
  password: string;

  @Prop()
  type: UserTypes;

  @Prop()
  active: boolean;

  @Prop()
  verifyed: boolean;

  @Prop()
  verifyHash: string;
}

export const UserSchema = SchemaFactory.createForClass(User);

export type UserDocument = HydratedDocument<User>;
