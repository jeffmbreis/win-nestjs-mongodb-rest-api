import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { User } from 'src/users/entities/user.entity';

export enum CompanyFieldOptions {
  HOSPITALITY = 'Hotelaria',
  RESTAURANT = 'Restaurante',
  PUB = 'Bar',
}

@Schema({
  timestamps: true,
})
export class Company {
  @Prop()
  image: string;

  @Prop()
  phone: string;

  @Prop()
  instagram: string;

  @Prop()
  cep: string;

  @Prop()
  address: string;

  @Prop()
  address_complement: string;

  @Prop()
  country: string;

  @Prop()
  state: string;

  @Prop()
  city: string;

  @Prop()
  field: CompanyFieldOptions;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: User.name })
  user: User;
}

export const CompanySchema = SchemaFactory.createForClass(Company);

export type CompanyDocument = HydratedDocument<Company>;
