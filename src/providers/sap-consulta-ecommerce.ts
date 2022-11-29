import { Injectable } from '@nestjs/common';
import * as moment from 'moment';
import axios from 'axios';

@Injectable()
export class SapConsultaEcommerce {
  handle(TABELA_PRECO: string, DEPOSITO: string) {
    return new Promise(async (resolve, reject) => {
      try {
        console.log('SapConsultaEcommerce', {
          TABELA_PRECO,
          DEPOSITO,
        });

        const url = `${process.env.SAP_HOST}/sapw2/ecommerce.asmx?WSDL`;
        // console.log({ url });

        const urlNode = require('url');
        const fixieUrl = urlNode.parse(process.env.FIXIE_URL);
        const [username, password] = fixieUrl.auth.split(':');
        const config = {
          headers: {
            'Content-Type': 'text/xml',
            'X-Requested-With': 'XMLHttpRequest',
          },
          timeout: 1000 * 60 * 2,
          proxy: {
            host: fixieUrl.hostname,
            port: fixieUrl.port,
            auth: {
              username,
              password,
            },
          },
        };

        const P_DATAB = moment().format('YYYYMMDD');

        const xml = `<?xml version="1.0" encoding="utf-8"?>
              <soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
              <soap:Body>
                <CONSULTA_ECOMMERCE xmlns="http://tempuri.org/">
                <P_KAPPL>V</P_KAPPL>
                <P_KSCHL>ZPR0</P_KSCHL>
                <P_WERKS>0008</P_WERKS>
                <P_REGIO>DF</P_REGIO>
                <P_ZZKVGR1>${TABELA_PRECO}</P_ZZKVGR1>
                <P_KOPOS>01</P_KOPOS>
                <P_LGORT>${DEPOSITO}</P_LGORT>
                <P_DATAB>${P_DATAB}</P_DATAB>
                <P_PRECO>X</P_PRECO>
                <MATNR></MATNR>
                </CONSULTA_ECOMMERCE>
              </soap:Body>
            </soap:Envelope>
        `;

        const result = await axios
          .post(url, xml, config)
          .then((resp) => {
            return resp.data;
          })
          .catch((error) => {
            console.log(error);
            reject(error);
          });
        // console.log('SapConsultaStatusPedidos 3 ');
        resolve(result);
      } catch (error) {
        console.log(error);
        reject(error);
      }
    });
  }
}
