import { Test, TestingModule } from '@nestjs/testing';
import { SapConsultaEcommerce } from './sap-consulta-ecommerce';

describe('SapConsultaEcommerce', () => {
  let provider: SapConsultaEcommerce;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SapConsultaEcommerce],
    }).compile();

    provider = module.get<SapConsultaEcommerce>(SapConsultaEcommerce);
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });
});
