import { Test, TestingModule } from '@nestjs/testing';
import { SapCriarPedidoVenda } from './sap-criar-pedido-venda';

describe('SapCriarPedidoVenda', () => {
  let provider: SapCriarPedidoVenda;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SapCriarPedidoVenda],
    }).compile();

    provider = module.get<SapCriarPedidoVenda>(SapCriarPedidoVenda);
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });
});
