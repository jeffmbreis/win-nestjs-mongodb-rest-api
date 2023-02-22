import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Exclude } from 'class-transformer';
import { HydratedDocument } from 'mongoose';

export enum SignUpUserRoles {
  CANDIDATE = 'candidate',
  COMNPANY = 'company',
}

export enum UserRoles {
  ADMIN = 'admin',
  CANDIDATE = 'candidate',
  COMPANY = 'company',
}

@Schema({
  timestamps: true,
})
export class User {
  @Prop()
  name: string;

  @Prop({
    unique: true,
  })
  email: string;

  @Prop()
  @Exclude()
  password: string;

  @Prop()
  type: UserRoles;

  @Prop()
  active: boolean;

  @Prop()
  verifyed: boolean;

  @Prop()
  verifyHash: string;
}

export const UserSchema = SchemaFactory.createForClass(User);

export type UserDocument = HydratedDocument<User>;
