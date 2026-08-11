import { Test, TestingModule } from '@nestjs/testing';
import { ServicePageConfigService } from './service-page-config.service';

describe('ServicePageConfigService', () => {
  let service: ServicePageConfigService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ServicePageConfigService],
    }).compile();

    service = module.get<ServicePageConfigService>(ServicePageConfigService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
