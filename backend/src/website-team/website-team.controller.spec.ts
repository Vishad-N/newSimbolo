import { Test, TestingModule } from '@nestjs/testing';
import { WebsiteTeamController } from './website-team.controller';
import { WebsiteTeamService } from './website-team.service';

describe('WebsiteTeamController', () => {
  let controller: WebsiteTeamController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [WebsiteTeamController],
      providers: [
        {
          provide: WebsiteTeamService,
          useValue: {},
        },
      ],
    }).compile();

    controller = module.get<WebsiteTeamController>(WebsiteTeamController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
