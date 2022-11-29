import { Injectable } from '@nestjs/common';
import axios from 'axios';
// import http from 'http';
// import https from 'https';

export class CriarPedidoVenda {
  piclist_id: number;
  EMPRESA: string;
  COD_CLIENTE: string;
  CONDICAO_PAGMTO: string;
  ORG_VENDAS: string;
  CANAL_DIST: string;
  SETOR_ATV: string;
  CENTRO: string;
  TIPO_DOC: string;
  TABELA_PRECO: string;
  NOME_CLIENTE: string;
  CPF: string;
  CNPJ: string;
  AUT: string;
  NSU: string;
  BAND: string;
  PRODUTOS: string;
  DEPOSITO: string;
  DEPOSITO_DEST: string;
  P_PAR_MAC: string;
  P_STOP_OV: string;
  ENDERECO: string;
  P_REF_DOC: string;
}

@Injectable()
export class SapCriarPedidoVenda {
  handle(createSapPedidoVendaDto: CriarPedidoVenda) {
    return new Promise(async (resolve, reject) => {
      try {
        const url = `${process.env.SAP_HOST}/sapw2/ecommerce.asmx?op=CRIAR_PEDIDO_VENDA3`;

        // const httpAgent = new http.Agent({ keepAlive: false });
        // const httpsAgent = new https.Agent({ keepAlive: false });

        const urlNode = require('url');
        const fixieUrl = urlNode.parse(process.env.FIXIE_URL);
        const [username, password] = fixieUrl.auth.split(':');
        const config = {
          // httpAgent,
          // httpsAgent,
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

        const {
          EMPRESA,
          COD_CLIENTE,
          CONDICAO_PAGMTO,
          ORG_VENDAS,
          CANAL_DIST,
          SETOR_ATV,
          CENTRO,
          TIPO_DOC,
          TABELA_PRECO,
          NOME_CLIENTE,
          CPF,
          CNPJ,
          AUT,
          NSU,
          BAND,
          PRODUTOS,
          DEPOSITO,
          DEPOSITO_DEST,
          P_PAR_MAC,
          P_STOP_OV,
          ENDERECO,
          P_REF_DOC,
        } = createSapPedidoVendaDto;

        // <?xml version="1.0" encoding="utf-8"?>
        // <soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
        // <soap:Body>
        // <CRIAR_PEDIDO_VENDA3 xmlns="http://tempuri.org/">
        // <EMPRESA>B001</EMPRESA>
        // <COD_CLIENTE>0008913083</COD_CLIENTE>
        // <CONDICAO_PAGMTO>L</CONDICAO_PAGMTO>
        // <ORG_VENDAS>1000</ORG_VENDAS>
        // <CANAL_DIST>01</CANAL_DIST>
        // <SETOR_ATV>01</SETOR_ATV>
        // <CENTRO>0008</CENTRO>
        // <TIPO_DOC>ZS59</TIPO_DOC>
        // <TABELA_PRECO>788</TABELA_PRECO>
        // <NOME_CLIENTE></NOME_CLIENTE>
        // <CPF>06059482406</CPF>
        // <CNPJ>01027058000191</CNPJ>
        // <AUT>567809</AUT>
        // <NSU>46820</NSU>
        // <BAND>01</BAND>
        // <PRODUTOS>177:1:7,99:0,00:0,00:0,00:UN</PRODUTOS>
        // <DEPOSITO>M204</DEPOSITO>
        // <DEPOSITO_DEST></DEPOSITO_DEST>
        // <P_PAR_MAC></P_PAR_MAC>
        // <P_STOP_OV></P_STOP_OV>
        // <ENDERECO></ENDERECO>
        // </CRIAR_PEDIDO_VENDA3>
        // </soap:Body>
        // </soap:Envelope>

        const xml = `<?xml version="1.0" encoding="utf-8"?>
              <soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
              <soap:Body>
                <CRIAR_PEDIDO_VENDA3 xmlns="http://tempuri.org/">
                  <EMPRESA>${EMPRESA}</EMPRESA>
                  <COD_CLIENTE>${COD_CLIENTE}</COD_CLIENTE>
                  <CONDICAO_PAGMTO>${CONDICAO_PAGMTO}</CONDICAO_PAGMTO>
                  <ORG_VENDAS>${ORG_VENDAS}</ORG_VENDAS>
                  <CANAL_DIST>${CANAL_DIST}</CANAL_DIST>
                  <SETOR_ATV>${SETOR_ATV}</SETOR_ATV>
                  <CENTRO>${CENTRO}</CENTRO>
                  <TIPO_DOC>${TIPO_DOC}</TIPO_DOC>
                  <TABELA_PRECO>${TABELA_PRECO}</TABELA_PRECO>
                  <NOME_CLIENTE>${NOME_CLIENTE}</NOME_CLIENTE>
                  <CPF>${
                    this.testaCPF(CPF) === true
                      ? this.clearCPF(CPF)
                      : '01612795000828'
                  }</CPF>
                  <CNPJ>${CNPJ}</CNPJ>
                  <AUT>${AUT}</AUT>
                  <NSU>${NSU}</NSU>
                  <BAND>${BAND}</BAND>
                  <PRODUTOS>${PRODUTOS}</PRODUTOS>
                  <DEPOSITO>${DEPOSITO}</DEPOSITO>
                  <DEPOSITO_DEST>${DEPOSITO_DEST}</DEPOSITO_DEST>
                  <P_PAR_MAC>${P_PAR_MAC}</P_PAR_MAC>
                  <P_STOP_OV>${P_STOP_OV}</P_STOP_OV>
                  <ENDERECO>${ENDERECO}</ENDERECO>
                  <P_REF_DOC>${P_REF_DOC}</P_REF_DOC>
                </CRIAR_PEDIDO_VENDA3>
              </soap:Body>
            </soap:Envelope>
      `;
        // console.log(xml);
        // resolve({ url, xml, config });

        const result = await axios
          .post(url, xml, config)
          .then((resp) => resp.data)
          .catch((e) => {
            console.log(e);
            resolve('');
          });
        resolve(result);
      } catch (error) {
        console.log({ error });
        resolve('');
        // reject(error);
      }
      // setTimeout(() => resolve(createSapPedidoVendaDto), 500);
    });
  }

  clearCPF(strCPF) {
    strCPF = strCPF.replace(/\D/g, '');

    while (strCPF.length < '00000000000'.length) {
      strCPF = `0${strCPF}`;
    }

    return strCPF;
  }

  testaCPF(strCPF) {
    var Soma;
    var Resto;
    Soma = 0;

    strCPF = this.clearCPF(strCPF);

    if (strCPF == '00000000000') return false;
    if (strCPF == '11111111111') return false;
    if (strCPF == '22222222222') return false;
    if (strCPF == '33333333333') return false;
    if (strCPF == '44444444444') return false;
    if (strCPF == '55555555555') return false;
    if (strCPF == '66666666666') return false;
    if (strCPF == '77777777777') return false;
    if (strCPF == '88888888888') return false;
    if (strCPF == '99999999999') return false;

    for (let i = 1; i <= 9; i++)
      Soma = Soma + parseInt(strCPF.substring(i - 1, i)) * (11 - i);
    Resto = (Soma * 10) % 11;

    if (Resto == 10 || Resto == 11) Resto = 0;
    if (Resto != parseInt(strCPF.substring(9, 10))) return false;

    Soma = 0;
    for (let i = 1; i <= 10; i++)
      Soma = Soma + parseInt(strCPF.substring(i - 1, i)) * (12 - i);
    Resto = (Soma * 10) % 11;

    if (Resto == 10 || Resto == 11) Resto = 0;
    if (Resto != parseInt(strCPF.substring(10, 11))) return false;
    return true;
  }
}
