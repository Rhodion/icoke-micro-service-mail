import { RecoverPasswordDto } from './dto/recover-password.dto';
import { SignupValidationEmailDto } from './dto/signup-validation-email.dto';

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import Handlebars from 'handlebars';
import { Repository } from 'typeorm';

import { MUser } from '../entities/m-user.entity';

import { SendgridService } from '../providers/sendgrid/sendgrid.service';

const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');

@Injectable()
export class MailService {
  constructor(
    private readonly sendgridService: SendgridService,
    @InjectRepository(MUser)
    private readonly mUserRepository: Repository<MUser>,
  ) {}

  async recover_password(recoverPasswordDto: RecoverPasswordDto) {
    console.log('recover_password', { recoverPasswordDto });

    const user = await this.mUserRepository.findOneBy({
      id: recoverPasswordDto.user_id,
    });

    if (!user || !user.email || user.email === '') {
      return;
    }

    const { name } = user;
    const randomstring = Math.random().toString(32).slice(-6);
    const password_hash = await bcrypt.hash(randomstring, 8);

    await this.mUserRepository.save(Object.assign(user, { password_hash }));

    const templateStr = fs
      .readFileSync(
        path.resolve(__dirname, 'templates', 'recover-password.hbs'),
      )
      .toString('utf8');
    const template = Handlebars.compile(templateStr, { noEscape: true });

    const html = template({ name, randomstring });

    const mail = {
      to: user.email,
      subject: 'Recuperação de senha',
      from: 'iCoke - Brasal Refrigerantes<no-reply@brasal.com.br>',
      text: `Sua nova senha é ${randomstring}`,
      html,
    };

    // return;

    return await this.sendgridService.send(mail);
  }

  async signup_validation_email(
    signupValidationEmailDto: SignupValidationEmailDto,
  ) {
    console.log('signup_validation_email', { signupValidationEmailDto });

    const user = await this.mUserRepository.findOneBy({
      id: signupValidationEmailDto.user_id,
    });

    if (!user || !user.email || user.email === '') {
      return;
    }

    const { name } = user;

    // let email_token_verification = Math.floor(
    //   Math.random() * 1000000,
    // ).toString();
    // while (email_token_verification.length < 6) {
    //   email_token_verification += `0${email_token_verification}`;
    // }

    let total = 1;

    for (let index = 0; index < user.cpf.length; index++) {
      if (index % 2 === 0) {
        total = total + user.cpf.charCodeAt(index);
      } else {
        total = total * user.cpf.charCodeAt(index);
      }
    }

    const email_token_verification = total
      .toString()
      .substring(total.toString().length - 6);

    await this.mUserRepository.save(
      Object.assign(user, { email_token_verification }),
    );

    const templateStr = fs
      .readFileSync(path.resolve(__dirname, 'templates', 'confirmation.hbs'))
      .toString('utf8');
    const template = Handlebars.compile(templateStr, { noEscape: true });

    const html = template({ name, email_token_verification });

    const mail = {
      to: user.email,
      subject: 'Verifique seu e-mail',
      from: 'iCoke - Brasal Refrigerantes<no-reply@brasal.com.br>',
      text: `Use o token ${email_token_verification} para fazer sua autenticação no aplicativo iCoke`,
      html,
    };

    // return;

    return await this.sendgridService.send(mail);
  }
}
