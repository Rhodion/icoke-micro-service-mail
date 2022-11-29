export function kafkaConfigClient(
  KAFKA_BROKER: string,
  KAFKA_USERNAME: string,
  KAFKA_PASSWORD: string,
): any {
  if (KAFKA_USERNAME === '' && KAFKA_PASSWORD === '') {
    return {
      brokers: [KAFKA_BROKER],
    };
  }

  return {
    brokers: [KAFKA_BROKER],
    sasl: {
      mechanism: 'scram-sha-256',
      username: KAFKA_USERNAME,
      password: KAFKA_PASSWORD,
    },
    ssl: true,
  };
}
