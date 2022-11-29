import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class SapConsultaStatusPedidos {
  handle(sapOrderId: number) {
    return new Promise(async (resolve, reject) => {
      try {
        console.log('SapConsultaStatusPedidos: ', { sapOrderId });

        // console.log({ sapOrderId });

        const url = `${process.env.SAP_HOST}/sapw2/lockers.asmx?op=CONSULTA_STATUS_PEDIDOS`;
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

        // console.log('SapConsultaStatusPedidos 1 ');

        const xml = `<?xml version="1.0" encoding="utf-8"?>
              <soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
              <soap:Body>
                <CONSULTA_STATUS_PEDIDOS xmlns="http://tempuri.org/">
                  <PEDIDO>${sapOrderId}</PEDIDO>
                </CONSULTA_STATUS_PEDIDOS>
              </soap:Body>
            </soap:Envelope>
      `;
        // console.log({ xml });

        // console.log('SapConsultaStatusPedidos 2 ');

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
        // console.log('SapConsultaStatusPedidos 4 ');
        console.log(error);
        reject(error);
      }
    });
  }
}
