import { Test, TestingModule } from '@nestjs/testing';
import { WebsiteTeamService } from './website-team.service';
import { PrismaService } from '../prisma/prisma.service';

describe('WebsiteTeamService', () => {
  let service: WebsiteTeamService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WebsiteTeamService,
        {
          provide: PrismaService,
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<WebsiteTeamService>(WebsiteTeamService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
