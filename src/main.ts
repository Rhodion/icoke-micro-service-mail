import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';
import { kafkaConfigClient } from './configs/kafka';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // console.log('process.env', process.env);

  app.connectMicroservice<MicroserviceOptions>(
    {
      transport: Transport.KAFKA,
      options: {
        client: kafkaConfigClient(
          process.env.KAFKA_BROKER,
          process.env.KAFKA_USERNAME,
          process.env.KAFKA_PASSWORD,
        ),
        consumer: {
          groupId: 'icoke-ms-mail-main',
        },
      },
    },
    { inheritAppConfig: true },
  );

  // app.connectMicroservice<MicroserviceOptions>(
  //   {
  //     transport: Transport.REDIS,
  //     options: {
  //       url: process.env.REDIS_URL,
  //     },
  //   },
  //   // { inheritAppConfig: true },
  // );

  await app.startAllMicroservices();
  // await app.listen(process.env.PORT || 3002);
}
bootstrap();
