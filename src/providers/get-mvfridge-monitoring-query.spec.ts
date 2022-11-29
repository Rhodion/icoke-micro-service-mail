import { Test, TestingModule } from '@nestjs/testing';
import { GetMvfridgeMonitoringQuery } from './get-mvfridge-monitoring-query';

describe('GetMvfridgeMonitoringQuery', () => {
  let provider: GetMvfridgeMonitoringQuery;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GetMvfridgeMonitoringQuery],
    }).compile();

    provider = module.get<GetMvfridgeMonitoringQuery>(GetMvfridgeMonitoringQuery);
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });
});
