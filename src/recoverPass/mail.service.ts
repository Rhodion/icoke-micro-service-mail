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
}
