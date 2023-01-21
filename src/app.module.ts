import { RefillModule } from './refill/mail.module';
import { ValidateMailModule } from './validateMail/mail.module';
import { RecoverPassModule } from './recoverPass/mail.module';
import { AuditSapLog } from './entities/audit-sap-log.entity';
import { MUser } from './entities/m-user.entity';
import { OrderSapLog } from './entities/order-sap-log.entity';
import { PiclistProduct } from './entities/piclist-product.entity';
import { PiclistSapLog } from './entities/piclist-sap-log.entity';
import { ProductReturnSapLog } from './entities/product-return-sap-log.entity';
import { RoutePiclist } from './entities/route-piclist.entity';

import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { GetMvfridgeMonitoringQuery } from './providers/get-mvfridge-monitoring-query';
import { SapConsultaEcommerce } from './providers/sap-consulta-ecommerce';
import { SapConsultaStatusPedidos } from './providers/sap-consulta-status-pedidos';
import { SapCriarPedidoVenda } from './providers/sap-criar-pedido-venda';
import { SendgridService } from './providers/sendgrid/sendgrid.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ScheduleModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.ICOKE_HOST,
      port: 3306,
      username: process.env.ICOKE_USERNAME,
      password: process.env.ICOKE_PASSWORD,
      database: process.env.ICOKE_DATABASE,
      entities: [
        RoutePiclist,
        PiclistProduct,
        PiclistSapLog,
        MUser,
        OrderSapLog,
        ProductReturnSapLog,
        AuditSapLog,
      ],
      synchronize: false,
    }),
    RecoverPassModule,
    ValidateMailModule,
    RefillModule,
  ],
  controllers: [],
  providers: [
    SapConsultaStatusPedidos,
    SapCriarPedidoVenda,
    SendgridService,
    SapConsultaEcommerce,
    GetMvfridgeMonitoringQuery,
  ],
})
export class AppModule {
  constructor(private dataSource: DataSource) {}
}
