import { MailerModule } from '@nestjs-modules/mailer';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { EmailService } from './email.service';

@Module({
  imports: [
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (config: ConfigService) => ({
        transport: {
          host: config.get('EMAIL_HOST'),
          secure: true,
          auth: {
            user: config.get('EMAIL_USERNAME'),
            pass: config.get('EMAIL_PASSWORD'),
          },
        },
      }),
      inject: [ConfigService],
    }),
    ConfigModule.forRoot(),
  ],
  controllers: [],
  providers: [EmailService],
  exports: [EmailService],
})
export class EmailModule {}
