import { AuditDto } from './dto/audit.dto';

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
import axios from 'axios';

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

  async audit(audittDto: AuditDto) {
    console.log('audit', { audittDto });
    try {
      const auditResult = await this.connection.query(`
        SELECT
          scheduled_audits.id,
          scheduled_audits.status,
          IFNULL(syndic.name, "") AS syndic_name,
          IFNULL(fridges.gebra, "") AS gebra,
          IFNULL(fridges.local, "") AS local,
          DATE_FORMAT(
            IFNULL(audits.reviewed_at, audits.created_at)
          , "%d/%m/%Y %H:%i") AS refill_at,
          DATE_FORMAT(
            IFNULL(audits.reviewed_at, audits.created_at)
          , "%d/%m") AS refill_at_only_date,
          IFNULL(deliveryman.name, "") AS deliveryman,
          IFNULL(audits.name, "") AS delivery_escort,
          IFNULL(audits.nf, "") AS nf,
          IFNULL(syndic.email, "") AS syndic_email,
          fridges.opt_report_audit,
          scheduled_audits.audit_id,
          scheduled_audits.fridge_id
        FROM
          scheduled_audits
        LEFT JOIN
          fridges
        ON
          fridges.id = scheduled_audits.fridge_id
        LEFT JOIN
          users AS syndic
        ON
          syndic.id = fridges.syndic_id
        LEFT JOIN
          users AS deliveryman
        ON
          deliveryman.id = scheduled_audits.user_id
        LEFT JOIN
          audits
        ON
          audits.id = scheduled_audits.audit_id
        WHERE
          scheduled_audits.id = ${audittDto.scheduled_audit_id}
      `);

      if (!auditResult || auditResult.length === 0) {
        console.log('no audit');
        return;
      }

      const audit = auditResult[0];
      // console.log({ audit });

      if (!audit || !audit.id) {
        console.log('no audit');
        return;
      }

      if (audit.status != 1 || !audit.audit_id) {
        console.log('not finished');
        return this.connection.query(`
          INSERT INTO
            scheduled_audit_condo_report_logs
          VALUES
            (
              NULL,
              ${audittDto.scheduled_audit_id},
              400,
              "Abastecimento não finalizado",
              "",
              CURRENT_TIMESTAMP(),
              CURRENT_TIMESTAMP()
            )
        `);
      }

      if (audit.opt_report_audit == 0) {
        return this.connection.query(`
          INSERT INTO
            scheduled_audit_condo_report_logs
          VALUES
            (
              NULL,
              ${audittDto.scheduled_audit_id},
              200,
              "Síndico prefere não receber e-mails",
              "",
              CURRENT_TIMESTAMP(),
              CURRENT_TIMESTAMP()
            )
        `);
      }

      if (audit.syndic_name == '') {
        return this.connection.query(`
          INSERT INTO
            scheduled_audit_condo_report_logs
          VALUES
            (
              NULL,
              ${audittDto.scheduled_audit_id},
              400,
              "Síndico não cadastrado",
              "",
              CURRENT_TIMESTAMP(),
              CURRENT_TIMESTAMP()
            )
        `);
      }

      if (audit.syndic_email == '') {
        return this.connection.query(`
          INSERT INTO
            scheduled_audit_condo_report_logs
          VALUES
            (
              NULL,
              ${audittDto.scheduled_audit_id},
              400,
              "Síndico sem e-mail cadastrado",
              "",
              CURRENT_TIMESTAMP(),
              CURRENT_TIMESTAMP()
            )
        `);
      }

      const {
        syndic_name,
        gebra,
        local,
        refill_at,
        deliveryman,
        delivery_escort,
        nf,
      } = audit;

      let losses = [];
      let leftovers = [];

      losses = await this.connection.query(`
        SELECT
          products.name AS name,
          audit_products.stock_diff * -1 AS qtd,
          CONCAT(
            "R$ ",
            FORMAT(
              IFNULL(
                audit_products.price * audit_products.stock_diff * -1,
                0
              ), 2, "pt_BR"
            )
          ) AS amount
        FROM
          audit_products  
        LEFT JOIN
          products
        ON
          audit_products.product_id = products.id
        WHERE
          stock_diff < 0
        AND
          audit_id = ${audit.audit_id}
        ORDER BY
          products.name ASC
      `);

      leftovers = await this.connection.query(`
        SELECT
          products.name AS name,
          audit_products.stock_diff AS qtd,
          CONCAT(
            "R$ ",
            FORMAT(
              IFNULL(
                audit_products.price * audit_products.stock_diff,
                0
              ), 2, "pt_BR"
            )
          ) AS amount
        FROM
          audit_products  
        LEFT JOIN
          products
        ON
          audit_products.product_id = products.id
        WHERE
          stock_diff > 0
        AND
          audit_id = ${audit.audit_id}
        ORDER BY
          products.name ASC
      `);

      // losses = [];
      // leftovers = [];

      const templateFile = `losses_${losses.length > 0 ? 1 : 0}_leftovers_${
        leftovers.length > 0 ? 1 : 0
      }.hbs`;

      const templateStr = fs
        .readFileSync(path.resolve(__dirname, 'templates', templateFile))
        .toString('utf8');
      const template = Handlebars.compile(templateStr, { noEscape: true });

      const orderReportUrl = await axios
        .get(`${process.env.REPORT_HOST}/fridge/${audit.fridge_id}`)
        .then(
          (resp) =>
            resp.data.object_url || 'https://icoke.brasaldigital.com.br',
        )
        .catch((e) => 'https://icoke.brasaldigital.com.br');

      const html = template({
        syndic_name,
        gebra,
        local,
        refill_at,
        deliveryman,
        delivery_escort,
        nf,
        losses,
        leftovers,
        orderReportUrl,
      });

      // const url =
      //   'https://s3-sa-east-1.amazonaws.com/icokebrasil-hom/pedidos/pedidos_1674518636.xlsx';
      // const xls = await axios({
      //   method: 'GET',
      //   url,
      //   responseType: 'blob',
      // }).then((result) => {
      //   return result.data;
      //   const outputFilename = 'xyzzzz.xlsx';
      //   fs.writeFileSync(outputFilename, result.data);
      //   return outputFilename;
      // });
      // console.log(xls);

      const mail = {
        // to: 'alvesroriz@gmail.com',
        // to: 'groriz@brasal.com.br',
        // to: 'incsilva@brasal.com.br',
        to: 'rhodions@gmail.com',
        // to: audit.syndic_email,
        subject: `${gebra} - Resumo de Auditoria & Inventário`,
        from: 'iCoke - Brasal Refrigerantes<no-reply@brasal.com.br>',
        text: `Resumo de Auditoria & Inventário`,
        html,
      };

      // console.log({ mail });

      // return;

      const result = await this.sendgridService.send(mail);
      // console.log(result);
      return this.connection.query(`
        INSERT INTO
          scheduled_audit_condo_report_logs
        VALUES
          (
            NULL,
            ${audittDto.scheduled_audit_id},
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
          scheduled_audit_condo_report_logs
        VALUES
          (
            NULL,
            ${audittDto.scheduled_audit_id},
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
