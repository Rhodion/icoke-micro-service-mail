import { Test, TestingModule } from '@nestjs/testing';
import { SapConsultaStatusPedidos } from './sap-consulta-status-pedidos';

describe('SapConsultaStatusPedidos', () => {
  let provider: SapConsultaStatusPedidos;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SapConsultaStatusPedidos],
    }).compile();

    provider = module.get<SapConsultaStatusPedidos>(SapConsultaStatusPedidos);
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });
});
