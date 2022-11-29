const convert = require('xml-js');

const xml = `<?xml version="1.0" encoding="utf-8"?>
<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema">
<soap:Body>
<CONSULTA_STATUS_PEDIDOSResponse xmlns="http://tempuri.org/">
  <CONSULTA_STATUS_PEDIDOSResult>
    <Pedidos xmlns="">
      <Status>S</Status>
      <Message>Pedidos encontrados com sucess</Message>
      <Pedido ORDEM="1004666325">
      <Status>
        <VBELN>1004666325</VBELN>
        <ERDAT>2022-11-28</ERDAT>
        <AUART>ZS58</AUART>
        <KUNNR>0000045101</KUNNR>
        <AUGRU></AUGRU>
        <BSARK>MCRT</BSARK>
        <BSTNK></BSTNK>
        <STATUS>PEDIDO CONFIRMADO</STATUS>
        <VENDEDOR_COD></VENDEDOR_COD>
        <VENDEDOR_NOME></VENDEDOR_NOME>
        <VENDEDOR_TELF></VENDEDOR_TELF>
        <COORDENADOR_COD></COORDENADOR_COD>
        <COORDENADOR_NOME></COORDENADOR_NOME>
        <COORDENADOR_TELF></COORDENADOR_TELF>
      </Status>
      <Itens>
        <Item ID="1">
          <POSNR>000010</POSNR>
          <MATNR>000000000000009000</MATNR>
          <ARKTX>MONSTER ENERGY LT 6X473ML RV</ARKTX>
          <MEINS>CX</MEINS>
          <KWMENG>32,000</KWMENG>
          <KONDM>02</KONDM>
          <ABGRU>
          </ABGRU>
          <BEZEI>
          </BEZEI>
          <CMPRE>6,99</CMPRE>
          <REMESSA>0808449026</REMESSA>
          <FATURA>NA</FATURA>
        </Item>
        <Item ID="2">
          <POSNR>000020</POSNR>
          <MATNR>000000000000001685</MATNR>
          <ARKTX>CRYSTAL MBJ CG PT 12X500 RV</ARKTX>
          <MEINS>CX</MEINS>
          <KWMENG>24,000</KWMENG>
          <KONDM>04</KONDM>
          <ABGRU>09</ABGRU>
          <BEZEI>Ruptura de produto</BEZEI>
          <CMPRE>2,99</CMPRE>
          <REMESSA>
          </REMESSA>
          <FATURA>NA</FATURA>
        </Item>
        <Item ID="3">
          <POSNR>000030</POSNR>
          <MATNR>000000000000000106</MATNR>
          <ARKTX>COCA COLA LT 15X310ML</ARKTX>
          <MEINS>CX</MEINS>
          <KWMENG>14,000</KWMENG>
          <KONDM>01</KONDM>
          <ABGRU>09</ABGRU>
          <BEZEI>Ruptura de produto</BEZEI>
          <CMPRE>3,59</CMPRE>
          <REMESSA>
          </REMESSA>
          <FATURA>NA</FATURA>
        </Item>
        <Item ID="4">
          <POSNR>000040</POSNR>
          <MATNR>000000000000001715</MATNR>
          <ARKTX>COCA S/A LT 12X310ML</ARKTX>
          <MEINS>CX</MEINS>
          <KWMENG>14,000</KWMENG>
          <KONDM>01</KONDM>
          <ABGRU>
          </ABGRU>
          <BEZEI>
          </BEZEI>
          <CMPRE>3,39</CMPRE>
          <REMESSA>0808449026</REMESSA>
          <FATURA>NA</FATURA>
        </Item>
        <Item ID="5">
          <POSNR>000050</POSNR>
          <MATNR>000000000000000864</MATNR>
          <ARKTX>SPRITE LEMON PET 6X510ML</ARKTX>
          <MEINS>CX</MEINS>
          <KWMENG>6,000</KWMENG>
          <KONDM>01</KONDM>
          <ABGRU>09</ABGRU>
          <BEZEI>Ruptura de produto</BEZEI>
          <CMPRE>4,29</CMPRE>
          <REMESSA>
          </REMESSA>
          <FATURA>NA</FATURA>
        </Item>
        <Item ID="6">
          <POSNR>000060</POSNR>
          <MATNR>000000000000004664</MATNR>
          <ARKTX>SHAKE WHEY CHOCO TB 12X250ML RV</ARKTX>
          <MEINS>CX</MEINS>
          <KWMENG>24,000</KWMENG>
          <KONDM>02</KONDM>
          <ABGRU>09</ABGRU>
          <BEZEI>Ruptura de produto</BEZEI>
          <CMPRE>5,99</CMPRE>
          <REMESSA>
          </REMESSA>
          <FATURA>NA</FATURA>
        </Item>
        <Item ID="7">
          <POSNR>000070</POSNR>
          <MATNR>000000000000001687</MATNR>
          <ARKTX>CRYSTAL MBJ SG PT 12X500 RV</ARKTX>
          <MEINS>CX</MEINS>
          <KWMENG>18,000</KWMENG>
          <KONDM>04</KONDM>
          <ABGRU>
          </ABGRU>
          <BEZEI>
          </BEZEI>
          <CMPRE>2,99</CMPRE>
          <REMESSA>0808449026</REMESSA>
          <FATURA>NA</FATURA>
        </Item>
        <Item ID="8">
          <POSNR>000080</POSNR>
          <MATNR>000000000000004662</MATNR>
          <ARKTX>SHAKE WHEY BAUN TB 12X250ML RV</ARKTX>
          <MEINS>CX</MEINS>
          <KWMENG>24,000</KWMENG>
          <KONDM>02</KONDM>
          <ABGRU>09</ABGRU>
          <BEZEI>Ruptura de produto</BEZEI>
          <CMPRE>5,99</CMPRE>
          <REMESSA>
          </REMESSA>
          <FATURA>NA</FATURA>
        </Item>
        <Item ID="9">
          <POSNR>000090</POSNR>
          <MATNR>000000000000001604</MATNR>
          <ARKTX>POWERADE UVA 6X500ML RV</ARKTX>
          <MEINS>CX</MEINS>
          <KWMENG>12,000</KWMENG>
          <KONDM>02</KONDM>
          <ABGRU>
          </ABGRU>
          <BEZEI>
          </BEZEI>
          <CMPRE>4,49</CMPRE>
          <REMESSA>0808449026</REMESSA>
          <FATURA>NA</FATURA>
        </Item>
        <Item ID="10">
          <POSNR>000100</POSNR>
          <MATNR>000000000000001608</MATNR>
          <ARKTX>POWERADE MIXPET 6X500ML RV</ARKTX>
          <MEINS>CX</MEINS>
          <KWMENG>12,000</KWMENG>
          <KONDM>02</KONDM>
          <ABGRU>
          </ABGRU>
          <BEZEI>
          </BEZEI>
          <CMPRE>4,49</CMPRE>
          <REMESSA>0808449026</REMESSA>
          <FATURA>NA</FATURA>
        </Item>
        <Item ID="11">
          <POSNR>000110</POSNR>
          <MATNR>000000000000000339</MATNR>
          <ARKTX>FANTA GUARANA ZERO 6X310 ML</ARKTX>
          <MEINS>CX</MEINS>
          <KWMENG>7,000</KWMENG>
          <KONDM>01</KONDM>
          <ABGRU>09</ABGRU>
          <BEZEI>Ruptura de produto</BEZEI>
          <CMPRE>2,59</CMPRE>
          <REMESSA>
          </REMESSA>
          <FATURA>NA</FATURA> 
        </Item>
        <Item ID="12">
          <POSNR>000120</POSNR>
          <MATNR>000000000000009065</MATNR>
          <ARKTX>REIGN MELON MAN LT 6X473ML RV</ARKTX>
          <MEINS>CX</MEINS>
          <KWMENG>24,000</KWMENG>
          <KONDM>02</KONDM>
          <ABGRU>
          </ABGRU>
          <BEZEI>
          </BEZEI>
          <CMPRE>7,99</CMPRE>
          <REMESSA>0808449026</REMESSA>
          <FATURA>NA</FATURA>
        </Item>
        <Item ID="13">
          <POSNR>000130</POSNR>
          <MATNR>000000000000009067</MATNR>
          <ARKTX>REIGN LEMON HDZ LT 6X473ML RV</ARKTX>
          <MEINS>CX</MEINS>
          <KWMENG>24,000</KWMENG>
          <KONDM>02</KONDM>
          <ABGRU>09</ABGRU>
          <BEZEI>Ruptura de produto</BEZEI>
          <CMPRE>7,99</CMPRE>
          <REMESSA>
          </REMESSA>
          <FATURA>NA</FATURA>
        </Item>
        <Item ID="14">
          <POSNR>000140</POSNR>
          <MATNR>000000000000001091</MATNR>
          <ARKTX>SCHWE TON S/A LT 6X310ML</ARKTX>
          <MEINS>CX</MEINS>
          <KWMENG>7,000</KWMENG>
          <KONDM>01</KONDM>
          <ABGRU>09</ABGRU>
          <BEZEI>Ruptura de produto</BEZEI>
          <CMPRE>3,59</CMPRE>
          <REMESSA>
          </REMESSA>
          <FATURA>NA</FATURA>
        </Item>
        <Item ID="15">
          <POSNR>000150</POSNR>
          <MATNR>000000000000000297</MATNR>
          <ARKTX>FANTA LAR S/A LT 6X310ML</ARKTX>
          <MEINS>CX</MEINS>
          <KWMENG>7,000</KWMENG>
          <KONDM>01</KONDM>
          <ABGRU>09</ABGRU>
          <BEZEI>Ruptura de produto</BEZEI>
          <CMPRE>3,29</CMPRE>
          <REMESSA>
          </REMESSA>
          <FATURA>NA</FATURA>
        </Item>
        <Item ID="16">
          <POSNR>000160</POSNR>
          <MATNR>000000000000000169</MATNR>
          <ARKTX>COCA PLUS CAFE EXPES LT 6X220ML</ARKTX>
          <MEINS>CX</MEINS>
          <KWMENG>7,000</KWMENG>
          <KONDM>01</KONDM>
          <ABGRU>09</ABGRU>
          <BEZEI>Ruptura de produto</BEZEI>
          <CMPRE>2,29</CMPRE>
          <REMESSA>
          </REMESSA>
          <FATURA>NA</FATURA>
        </Item>
        <Item ID="17">
          <POSNR>000170</POSNR>
          <MATNR>000000000000000803</MATNR>
          <ARKTX>SPRITE LT S/A 6X310ML</ARKTX>
          <MEINS>CX</MEINS>
          <KWMENG>7,000</KWMENG>
          <KONDM>01</KONDM>
          <ABGRU>
          </ABGRU>
          <BEZEI>
          </BEZEI>
          <CMPRE>3,29</CMPRE>
          <REMESSA>0808449026</REMESSA>
          <FATURA>NA</FATURA>
        </Item>
        <Item ID="18">
          <POSNR>000180</POSNR>
          <MATNR>000000000000001107</MATNR>
          <ARKTX>POWERADE FRUT TROP 6X500ML RV</ARKTX>
          <MEINS>CX</MEINS>
          <KWMENG>12,000</KWMENG>
          <KONDM>02</KONDM>
          <ABGRU>
          </ABGRU>
          <BEZEI>
          </BEZEI>
          <CMPRE>4,49</CMPRE>
          <REMESSA>0808449026</REMESSA>
          <FATURA>NA</FATURA>
        </Item>
        <Item ID="19">
          <POSNR>000190</POSNR>
          <MATNR>000000000000001495</MATNR>
          <ARKTX>POWERADE LIM 6X500ML RV</ARKTX>
          <MEINS>CX</MEINS>
          <KWMENG>6,000</KWMENG>
          <KONDM>02</KONDM>
          <ABGRU>
          </ABGRU>
          <BEZEI>
          </BEZEI>
          <CMPRE>4,49</CMPRE>
          <REMESSA>0808449026</REMESSA>
          <FATURA>NA</FATURA>
        </Item>
        <Item ID="20">
          <POSNR>000200</POSNR>
          <MATNR>000000000000001606</MATNR>
          <ARKTX>POWERADE LAR 6X500ML RV</ARKTX>
          <MEINS>CX</MEINS>
          <KWMENG>6,000</KWMENG>
          <KONDM>02</KONDM>
          <ABGRU>
          </ABGRU>
          <BEZEI>
          </BEZEI>
          <CMPRE>4,49</CMPRE>
          <REMESSA>0808449026</REMESSA>
          <FATURA>NA</FATURA>
        </Item>
      </Itens>
      <Notas />
      <Transporte />
      </Pedido>
    </Pedidos>
  </CONSULTA_STATUS_PEDIDOSResult>
</CONSULTA_STATUS_PEDIDOSResponse>
</soap:Body>
</soap:Envelope>`;

// console.log(xml);

var result = convert.xml2js(xml, {
  compact: true,
});

// console.log(result);

if (
  !result['soap:Envelope'] ||
  !result['soap:Envelope']['soap:Body'] ||
  !result['soap:Envelope']['soap:Body']['CONSULTA_STATUS_PEDIDOSResponse'] ||
  !result['soap:Envelope']['soap:Body']['CONSULTA_STATUS_PEDIDOSResponse'][
    'CONSULTA_STATUS_PEDIDOSResult'
  ] ||
  !result['soap:Envelope']['soap:Body']['CONSULTA_STATUS_PEDIDOSResponse'][
    'CONSULTA_STATUS_PEDIDOSResult'
  ]['Pedidos'] ||
  !result['soap:Envelope']['soap:Body']['CONSULTA_STATUS_PEDIDOSResponse'][
    'CONSULTA_STATUS_PEDIDOSResult'
  ]['Pedidos']['Pedido']
) {
  console.log('Pedido de compras retornado vazio.');
}

const pedido =
  result['soap:Envelope']['soap:Body']['CONSULTA_STATUS_PEDIDOSResponse'][
    'CONSULTA_STATUS_PEDIDOSResult'
  ]['Pedidos']['Pedido'];

// console.log(pedido);

let products = pedido.Itens.Item;

// console.log(products);

if (products.MATNR !== undefined) {
  products = [products];
}
// console.log(products);

piclist_products = products.map((product) => {
  const sku = parseInt(product.MATNR._text);

  const ABGRU = product.ABGRU;

  const ruptura =
    product.ABGRU._text && product.ABGRU._text === '09' ? true : false;

  const noPrice = product.CMPRE._text && parseInt(product.CMPRE._text) === 0;

  const qtd = ruptura || noPrice ? 0 : parseInt(product.KWMENG._text);

  // if (sku == '1685') {
  //   console.log({ sku, ruptura, qtd, product, ABGRU });
  // }

  return { sku, ruptura, qtd, product, ABGRU };
});

// console.log(piclist_products);

if (
  !piclist_products ||
  piclist_products === undefined ||
  piclist_products.length == 0
) {
  console.log('Pedido de compras retornado vazio.');
}

piclist_products = piclist_products.filter(
  (piclist_product) => piclist_product.qtd > 0,
);

console.log(piclist_products);

UPDATE
piclist_products
SET
qtd = 0
WHERE
piclist_id = ${createValidateRouteDto.piclist_id}
