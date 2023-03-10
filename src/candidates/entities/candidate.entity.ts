import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { User } from 'src/users/entities/user.entity';

export enum MaritalStatusOptions {
  SINGLE = 'Solteiro(a)',
  MARRIED = 'Casado(a)',
  SEPARATE = 'Separado(a)',
  DIVORCED = 'Divorciado(a)',
  WIDOWER = 'Viuvo(a)',
}

@Schema({
  timestamps: true,
})
export class Candidate {
  @Prop()
  image: string;

  @Prop()
  birthday: string;

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
  salary_expectation: number;

  @Prop()
  children: number;

  @Prop()
  marital_status: MaritalStatusOptions;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: User.name })
  user: User;
}

export const CandidateSchema = SchemaFactory.createForClass(Candidate);

export type CandidateDocument = HydratedDocument<Candidate>;
