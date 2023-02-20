import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';
import { MaritalStatusOptions } from '../entities/candidate.entity';

export class CreateCandidateDto {
  @IsNotEmpty()
  @IsString()
  readonly name: string;

  @IsNotEmpty()
  @IsEmail()
  readonly email: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  readonly password: string;

  @IsString()
  readonly birthday: string;

  @IsString()
  readonly phone: string;

  @IsString()
  readonly instagram: string;

  @IsString()
  readonly cep: string;

  @IsString()
  readonly address: string;

  @IsString()
  readonly address_complement: string;

  @IsString()
  readonly country: string;

  @IsString()
  readonly state: string;

  @IsString()
  readonly city: string;

  @IsString()
  readonly salary_expectation: number;

  @IsString()
  readonly children: number;

  @IsString()
  readonly marital_status: MaritalStatusOptions;
}
