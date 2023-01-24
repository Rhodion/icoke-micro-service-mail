import { RefillDto } from './dto/refill.dto';

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import Handlebars from 'handlebars';
import { Repository } from 'typeorm';
import { InjectConnection } from '@nestjs/typeorm';
import { Connection } from 'typeorm';

import { MUser } from '../entities/m-user.entity';

import { SendgridService } from '../providers/sendgrid/sendgrid.service';
import * as moment from 'moment';
import 'moment/locale/pt-br';

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
    try {
      const refillResult = await this.connection.query(`
        SELECT
          refills.id,
          refills.product_return_done,
          refills.finished_by,
          refills.product_return_id,
          IFNULL(syndic.name, "") AS syndic_name,
          IFNULL(fridges.gebra, "") AS gebra,
          IFNULL(fridges.local, "") AS local,
          DATE_FORMAT(refills.finished_at, "%d/%m/%Y %H:%i") AS refill_at,
          DATE_FORMAT(refills.finished_at, "%d/%m") AS refill_at_only_date,
          IFNULL(deliveryman.name, "") AS deliveryman,
          IFNULL(refills.name, "") AS delivery_escort,
          IFNULL(piclists.nf, "") AS nf,
          IFNULL(syndic.email, "") AS syndic_email,
          fridges.opt_report_refill
        FROM
          refills 
        LEFT JOIN
          fridges
        ON
          fridges.id = refills.fridge_id
        LEFT JOIN
          users AS syndic
        ON
          syndic.id = fridges.syndic_id
        LEFT JOIN
          users AS deliveryman
        ON
          deliveryman.id = refills.finished_by
        LEFT JOIN
          piclists
        ON
          piclists.id = refills.piclist_id
        WHERE
          refills.id = ${refillDto.refill_id}
    `);

      if (!refillResult || refillResult.length === 0) {
        console.log('no refill');
        return;
      }

      const refill = refillResult[0];
      // console.log({ refill });

      if (!refill || !refill.id) {
        console.log('no refill');
        return;
      }

      if (refill.product_return_done == 0 || !refill.finished_by) {
        console.log('not finished');
        return this.connection.query(`
        INSERT INTO
          refill_condo_report_logs
        VALUES
          (
            NULL,
            ${refillDto.refill_id},
            400,
            "Abastecimento não finalizado",
            "",
            CURRENT_TIMESTAMP(),
            CURRENT_TIMESTAMP()
          )
      `);
      }

      if (refill.opt_report_refill == 0) {
        return this.connection.query(`
          INSERT INTO
            refill_condo_report_logs
          VALUES
            (
              NULL,
              ${refillDto.refill_id},
              200,
              "Síndico prefere não receber e-mails",
              "",
              CURRENT_TIMESTAMP(),
              CURRENT_TIMESTAMP()
            )
        `);
      }

      if (refill.syndic_name == '') {
        return this.connection.query(`
        INSERT INTO
          refill_condo_report_logs
        VALUES
          (
            NULL,
            ${refillDto.refill_id},
            400,
            "Síndico não cadastrado",
            "",
            CURRENT_TIMESTAMP(),
            CURRENT_TIMESTAMP()
          )
      `);
      }

      if (refill.syndic_email == '') {
        return this.connection.query(`
        INSERT INTO
          refill_condo_report_logs
        VALUES
          (
            NULL,
            ${refillDto.refill_id},
            400,
            "Síndico sem e-mail cadastrado",
            "",
            CURRENT_TIMESTAMP(),
            CURRENT_TIMESTAMP()
          )
      `);
      }

      // const syndic_name = 'Glayton';
      // const gebra = 'GEBRA123451';
      // const local = 'LIVERPOOL CERVEJA 1';
      // const refill_at = '30/10/2022 10:25 1';
      // const deliveryman = 'Glayton Roriz 1';
      // const delivery_escort = 'Rhodion 1';
      // const nf = 'xxxxxxx1';

      const {
        syndic_name,
        gebra,
        local,
        refill_at,
        deliveryman,
        delivery_escort,
        nf,
        refill_at_only_date,
      } = refill;

      let piclists = [];
      let productReturns = [];

      piclists = await this.connection.query(`
        SELECT
          products.name AS name, 
          piclist_products.qtd AS qtd
        FROM
          refills 
        LEFT JOIN
          piclists
        ON
          piclists.id = refills.piclist_id
        LEFT JOIN
          piclist_products
        ON
          piclist_products.piclist_id = piclists.id
        LEFT JOIN
          products
        ON  
          piclist_products.product_id = products.id
        WHERE
          refills.id = ${refillDto.refill_id}
        ORDER BY
          products.name ASC
    `);

      if (refill.product_return_id) {
        productReturns = await this.connection.query(`
          SELECT
            products.name AS name,
            product_return_items.qtd AS qtd
          FROM
            refills 
          JOIN
            product_return_items
          ON
            product_return_items.id = refills.product_return_id
          JOIN
            products
          ON
            products.id = product_return_items.product_id
          WHERE
            refills.id = ${refillDto.refill_id}
        `);
      }

      // productReturns = [];

      const templateFile =
        productReturns.length > 0 ? 'refill.hbs' : 'refill_no_returns.hbs';

      const templateStr = fs
        .readFileSync(path.resolve(__dirname, 'templates', templateFile))
        .toString('utf8');
      const template = Handlebars.compile(templateStr, { noEscape: true });

      const html = template({
        syndic_name,
        gebra,
        local,
        refill_at,
        deliveryman,
        delivery_escort,
        nf,
        piclists,
        productReturns,
      });

      const mail = {
        // to: 'alvesroriz@gmail.com',
        // to: 'groriz@brasal.com.br',
        to: 'incsilva@brasal.com.br',
        // to: 'rhodions@gmail.com',
        // to: refill.syndic_email,
        subject: `${gebra} - Resumo de Abastecimento ${refill_at_only_date}`,
        from: 'iCoke - Brasal Refrigerantes<no-reply@brasal.com.br>',
        text: `Abastecimento`,
        html,
      };

      // console.log({ mail });

      const result = await this.sendgridService.send(mail);
      // console.log(result);
      return this.connection.query(`
        INSERT INTO
          refill_condo_report_logs
        VALUES
          (
            NULL,
            ${refillDto.refill_id},
            200,
            "E-mail enviado com sucesso",
            "",
            CURRENT_TIMESTAMP(),
            CURRENT_TIMESTAMP()
          )
      `);
    } catch (error) {
      console.log({ error });
      return this.connection.query(`
        INSERT INTO
          refill_condo_report_logs
        VALUES
          (
            NULL,
            ${refillDto.refill_id},
            400,
            "${error.message}",
            "",
            CURRENT_TIMESTAMP(),
            CURRENT_TIMESTAMP()
          )
      `);
    }
  }
}
