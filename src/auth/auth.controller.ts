import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SendVerificationEmailDto } from './dto/send-verification-email-dto';
import { SignInDto } from './dto/sign-in-dto';
import { SignUpDto } from './dto/sign-up-dto';
import { VerifyEmailDto } from './dto/verify-email-dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signin')
  signIn(@Body() signIn: SignInDto) {
    return this.authService.signIn(signIn);
  }

  @Post('signup')
  signUp(@Body() signUpDto: SignUpDto) {
    return this.authService.signUp(signUpDto);
  }

  @Post('send-verification-email')
  sendVerificationEmail(@Body() { email }: SendVerificationEmailDto) {
    return this.authService.sendVerificationLinkEmail(email);
  }

  @Post('verify-email')
  verifyEmail(@Body() { token }: VerifyEmailDto) {
    return this.authService.verifyEmail(token);
  }
}
