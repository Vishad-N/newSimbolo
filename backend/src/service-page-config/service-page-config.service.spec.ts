import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../prisma/prisma.service';
import { ServicePageConfigService } from './service-page-config.service';

describe('ServicePageConfigService', () => {
  let service: ServicePageConfigService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ServicePageConfigService,
        {
          provide: PrismaService,
          useValue: {
            service: {
              findUnique: jest.fn(),
            },
            servicePageConfig: {
              findUnique: jest.fn(),
              upsert: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    service = module.get<ServicePageConfigService>(ServicePageConfigService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
