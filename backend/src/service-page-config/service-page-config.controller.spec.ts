import { Test, TestingModule } from '@nestjs/testing';
import { ServicePageConfigController } from './service-page-config.controller';

describe('ServicePageConfigController', () => {
  let controller: ServicePageConfigController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ServicePageConfigController],
    }).compile();

    controller = module.get<ServicePageConfigController>(ServicePageConfigController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
