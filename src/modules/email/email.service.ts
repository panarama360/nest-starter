/**
 * Created by Ivan on 25.01.2021
 */

import { Injectable, Logger } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class EmailService {
  constructor(private readonly mailerService: MailerService) {
  }
  async sendConfirmEmail(email: string, token: string){
    if(process.env.NODE_ENV=='development') return Logger.log(`sendConfirmEmail - Email: ${email}, Token: ${token}`, EmailService.name);
    await this.mailerService.sendMail({
      to: email,
      subject: 'Email Confirmation',
      template: 'email_confirmation',
      context: {
        token
      },
    });
  }

  async recoveryPassword(email: string, token: string){
    if(process.env.NODE_ENV=='development') return Logger.log(`recoveryPassword - Email: ${email}, Token: ${token}`, EmailService.name);
    await this.mailerService.sendMail({
      to: email,
      subject: 'Recovery Password',
      template: 'recovery_password',
      context: {
        token
      },
    });
  }
}