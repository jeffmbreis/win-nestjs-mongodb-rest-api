import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsString,
  Matches,
} from 'class-validator';
import { MessageHelper } from 'src/helpers/message.helper';
import { RegexHelper } from 'src/helpers/regex.helper';
import { SignUpUserRoles } from 'src/users/entities/user.entity';

export class SignUpDto {
  @IsNotEmpty()
  @IsString()
  readonly name: string;

  @IsNotEmpty()
  @IsEmail()
  readonly email: string;

  @IsNotEmpty()
  @IsString()
  @Matches(RegexHelper.password, {
    message: MessageHelper.INVALID_PASSWORD_FORMAT,
  })
  readonly password: string;

  @IsNotEmpty()
  @IsEnum(SignUpUserRoles)
  readonly type: SignUpUserRoles;
}
