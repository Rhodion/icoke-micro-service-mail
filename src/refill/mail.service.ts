import { RefillDto } from './dto/refill.dto';

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import Handlebars from 'handlebars';
import { Repository } from 'typeorm';
import { InjectConnection } from '@nestjs/typeorm';
import { Connection } from 'typeorm';

import { MUser } from '../entities/m-user.entity';

import { SendgridService } from '../providers/sendgrid/sendgrid.service';

const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');

@Injectable()
export class MailService {
  constructor(
    @InjectConnection() private readonly connection: Connection,
    private readonly sendgridService: SendgridService,
    @InjectRepository(MUser)
    private readonly mUserRepository: Repository<MUser>,
  ) {}

  async refill(refillDto: RefillDto) {
    console.log('refill', { refillDto });

    const refillResult = await this.connection.query(`
      SELECT
        *
      FROM
        refills
      WHERE
        id = ${refillDto.refill_id}
    `);

    if (!refillResult || refillResult.length === 0) {
      console.log('no refill');
      return;
    }

    const refill = refillResult[0];
    console.log({ refill });

    if (
      !refill ||
      !refill.id ||
      !refill.product_return_id ||
      refill.product_return_done == 0
    ) {
      console.log('no refill');
      return;
    }

    // return;

    // const user = await this.mUserRepository.findOneBy({
    //   id: refillDto.refill_id,
    // });

    // if (!user || !user.email || user.email === '') {
    //   return;
    // }

    // const { name } = user;
    // const randomstring = Math.random().toString(32).slice(-6);
    // const password_hash = await bcrypt.hash(randomstring, 8);

    // await this.mUserRepository.save(Object.assign(user, { password_hash }));

    const templateStr = fs
      .readFileSync(path.resolve(__dirname, 'templates', 'refill.hbs'))
      .toString('utf8');
    const template = Handlebars.compile(templateStr, { noEscape: true });

    // const html = template({ name, randomstring });
    const html = template({});

    const mail = {
      to: 'rhodions@gmail.com',
      // to: user.email,
      subject: `GEBRA12345 - Resumo de Abastecimento 30/10`,
      from: 'iCoke - Brasal Refrigerantes<no-reply@brasal.com.br>',
      text: `Sua nova senha é `,
      html,
    };

    const result = await this.sendgridService.send(mail);
    console.log({ result });
    return;
  }
}
