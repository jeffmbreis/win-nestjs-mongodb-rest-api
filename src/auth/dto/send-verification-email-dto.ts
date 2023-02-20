import { IsEmail, IsNotEmpty } from 'class-validator';

export class SendVerificationEmailDto {
  @IsNotEmpty()
  @IsEmail()
  readonly email: string;
}
