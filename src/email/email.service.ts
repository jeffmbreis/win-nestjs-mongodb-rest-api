import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class EmailService {
  constructor(private emailService: MailerService) {}

  sendMail(options) {
    return this.emailService.sendMail(options);
  }
}
