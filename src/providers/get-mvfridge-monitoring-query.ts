import { Injectable } from '@nestjs/common';

@Injectable()
export class GetMvfridgeMonitoringQuery {
  handle(fridge_id: number): string {
    const ESTOQUE_ICOKE = `IFNULL(fridge_products.qtd, 0)`;

    const QTD_PICLIST_ABERTO1 = `
        SELECT
          piclists.fridge_id,
          piclist_products.product_id,
          piclist_products.channel,
          piclist_products.qtd
        FROM
          piclists
        LEFT JOIN
          piclist_products
        ON
          piclist_products.piclist_id = piclists.id
        WHERE
          piclists.status = 0
    `;

    const QTD_PICLIST_ABERTO = `
      IFNULL((
        SELECT
          piclist_products.qtd
        FROM
          piclists
        LEFT JOIN
          piclist_products
        ON
          piclist_products.piclist_id = piclists.id
        WHERE
          piclists.fridge_id = fridges.id
        AND
          piclists.status = 0
        AND
          piclist_products.product_id = fridge_products.product_id
        AND
          piclist_products.channel = fridge_products.channel
      ),0)
    `;

    const QTD_ESTOQUE_SAP = `ROUND((fridge_products.qtd_sap / 1000), 3)`;

    const QTD_DIFERENCA_SAP_X_ICOKE = `(${QTD_ESTOQUE_SAP} - (${ESTOQUE_ICOKE} + ${QTD_PICLIST_ABERTO}))`;

    // const QTD_NAO_FATURADO_CONSUMIDOR1 = `
    //     SELECT
    //       orders.fridge_id,
    //       order_products.qtd,
    //       order_products.product_id,
    //       order_products.product_channel
    //     FROM
    //       orders
    //     LEFT JOIN
    //       order_products
    //     ON
    //       order_products.order_id = orders.id
    //     WHERE
    //       YEAR(orders.created_at) = YEAR(CURRENT_DATE)
    //     AND
    //       MONTH(orders.created_at) = MONTH(CURRENT_DATE)
    //     AND
    //       orders.status = 1
    //     AND
    //     (
    //       SELECT
    //         COUNT(*)
    //       FROM
    //         order_sap_logs
    //       WHERE
    //         order_sap_logs.order_id = orders.id
    //       AND
    //         status = 200
    //     ) = 0
    //     ORDER BY
    //       orders.id DESC
    // `;

    const QTD_NAO_FATURADO_CONSUMIDOR = `
      IFNULL((
        SELECT
          SUM(order_products.qtd)
        FROM
          orders
        LEFT JOIN
          order_products
        ON
          order_products.order_id = orders.id
        WHERE
          orders.fridge_id = fridges.id
        AND 
          YEAR(orders.created_at) = YEAR(CURRENT_DATE)
        AND 
          MONTH(orders.created_at) = MONTH(CURRENT_DATE)
        AND
          orders.status = 1
        AND
          orders.sap_200 = 0
        AND
          order_products.product_id = fridge_products.product_id
        AND
          order_products.product_channel = fridge_products.channel
        GROUP BY
          order_products.product_id
      ),0)
    `;

    /*
    (
            SELECT
              COUNT(*)
            FROM
              audit_sap_logs
            WHERE
              audit_sap_logs.audit_id = audits.id
            AND
              status = 200
          )
    */

    const QTD_NAO_FATURADO_CONDOMINIO = `
      IFNULL((
        SELECT
          ABS(SUM(audit_products.stock_diff))
        FROM
          audits
        LEFT JOIN
          audit_products
        ON
          audit_products.audit_id = audits.id
        WHERE
          audits.fridge_id = fridges.id
        AND 
          YEAR(audits.created_at) = YEAR(CURRENT_DATE)
        AND 
          MONTH(audits.created_at) = MONTH(CURRENT_DATE)
        AND
          audits.id > 9636
        AND
          audits.sap_200 = 0
        AND
          audit_products.product_id = fridge_products.product_id
        AND
          audit_products.channel = fridge_products.channel
        AND
          audit_products.stock_diff < 0
        GROUP BY 
          audit_products.product_id
      ),0)
    `;

    const QTD_RETORNO_NAO_FATURADO = `
      IFNULL((
        SELECT
          COUNT(*)
        FROM
          product_return_to_sap_items
        LEFT JOIN
          product_return_items
        ON
          product_return_items.id = product_return_to_sap_items.product_return_item_id
        LEFT JOIN
          product_returns
        ON
          product_returns.id = product_return_items.product_return_id
        WHERE
          product_returns.fridge_id = fridges.id
        AND
          (
            SELECT
              COUNT(*)
            FROM
              product_return_to_sap_item_logs
            WHERE
              product_return_to_sap_item_logs.product_return_to_sap_item_id = product_return_to_sap_items.id
            AND
              status = 200
          ) = 0
        AND
          product_return_items.product_id = fridge_products.product_id
        AND
          product_return_items.channel = fridge_products.channel
      ),0)
    `;

    const DIFERENCA_CALCULADA = `(${QTD_DIFERENCA_SAP_X_ICOKE} - (${QTD_NAO_FATURADO_CONSUMIDOR} + ${QTD_NAO_FATURADO_CONDOMINIO} + ${QTD_RETORNO_NAO_FATURADO}))`;

    const QTD_SOBRAS_DO_MES = `
      IFNULL((
        SELECT
          SUM(audit_products.stock_diff)
        FROM
          audits
        LEFT JOIN
          audit_products
        ON
          audit_products.audit_id = audits.id
        WHERE
          audits.fridge_id = fridges.id
        AND 
          YEAR(audits.created_at) = YEAR(CURRENT_DATE)
        AND 
          MONTH(audits.created_at) = MONTH(CURRENT_DATE)
        AND
          audit_products.product_id = fridge_products.product_id
        AND
          audit_products.channel = fridge_products.channel
        AND
          audit_products.stock_diff > 0
        GROUP BY 
          audit_products.product_id
      ),0)
    `;

    const DIFERENCA_COM_AJUSTES_SOBRAS = `(${DIFERENCA_CALCULADA} + ${QTD_SOBRAS_DO_MES})`;

    return `
      INSERT INTO
        mv_fridge_monitoring
      (
        fridge_id,
        fridge_cod_cliente,
        fridge_gebra,
        fridge_deposito,
        fridge_local,
        product_sku,
        product_name,
        product_pack,
        planogram_qtd,
        fridge_qtd,
        open_piclist_qtd,
        sap_qtd,
        sap_fridge_diff,
        not_invoiced_customer_qtd,
        not_invoiced_condo_qtd,
        not_invoiced_product_return_qtd,
        calculated_diff,
        leftovers_of_the_month_qtd,
        calculated_diff_with_leftovers_of_the_month_qtd,
        created_at,
        updated_at
      )
      SELECT
        ${fridge_id} AS fridge_id,
        fridges.cod_cliente AS "COD_CLIENTE",
        fridges.gebra AS "GEBRA",
        fridges.deposito AS "DEPOSITO",
        fridges.local AS "CONDOMINIO",
        products.sku AS "SKU",
        products.name AS "PRODUTO",
        IF(products.only_pack = 0, "UN", "CX") AS "PACK",
        IFNULL(planogram_products.qtd, 0) AS "QTD_PLANOGRAMA",
        ${ESTOQUE_ICOKE} AS "ESTOQUE_ICOKE",
        ${QTD_PICLIST_ABERTO} AS "QTD_PICLIST_ABERTO",
        ${QTD_ESTOQUE_SAP} AS "QTD_ESTOQUE_SAP",
        ${QTD_DIFERENCA_SAP_X_ICOKE} AS QTD_DIFERENCA_SAP_X_ICOKE,
        ${QTD_NAO_FATURADO_CONSUMIDOR} AS "QTD_NAO_FATURADO_CONSUMIDOR",
        ${QTD_NAO_FATURADO_CONDOMINIO} AS "QTD_NAO_FATURADO_CONDOMINIO",
        ${QTD_RETORNO_NAO_FATURADO} AS "QTD_RETORNO_NAO_FATURADO",
        ${DIFERENCA_CALCULADA} AS "DIFERENCA_CALCULADA",
        ${QTD_SOBRAS_DO_MES} AS "QTD_SOBRAS_DO_MES",
        ${DIFERENCA_COM_AJUSTES_SOBRAS} AS "DIFERENCA_COM_AJUSTES_SOBRAS",
        NOW() AS created_at,
        NOW() AS updated_at
      FROM
        fridges
      LEFT JOIN
        fridge_products
      ON
        fridge_products.fridge_id = fridges.id
      LEFT JOIN
        products
      ON  
        products.id = fridge_products.product_id
      LEFT JOIN
        planogram_products
      ON
        planogram_products.planogram_id = fridges.planogram_id
      AND 
        planogram_products.product_id = fridge_products.product_id
      AND 
        planogram_products.channel = fridge_products.channel
      WHERE
        fridges.id = ${fridge_id}
    `;
  }
}
