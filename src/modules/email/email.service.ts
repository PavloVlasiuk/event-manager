import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { emailOptions } from './types/email-options.type';
import { resolve } from 'path';

@Injectable()
export class EmailService {
  constructor(private readonly mailerService: MailerService) {}

  async sendTemplatedEmail({
    to,
    subject,
    message,
    link,
  }: emailOptions): Promise<void> {
    await this.mailerService
      .sendMail({
        to,
        subject,
        template: resolve('./src/modules/email/templates/template.hbs'),
        context: {
          message,
          link,
        },
      })
      .catch((error) => {
        console.error(error);
      });
  }
}
