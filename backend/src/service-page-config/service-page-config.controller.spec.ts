import { Test, TestingModule } from '@nestjs/testing';
import { ServicePageConfigController } from './service-page-config.controller';
import { ServicePageConfigService } from './service-page-config.service';

describe('ServicePageConfigController', () => {
  let controller: ServicePageConfigController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ServicePageConfigController],
      providers: [
        {
          provide: ServicePageConfigService,
          useValue: {
            findByServiceSlug: jest.fn(),
            upsert: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<ServicePageConfigController>(ServicePageConfigController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
