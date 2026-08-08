import { Module } from '@nestjs/common';
import { WebsiteTeamController } from './website-team.controller';
import { WebsiteTeamService } from './website-team.service';

@Module({
  controllers: [WebsiteTeamController],
  providers: [WebsiteTeamService]
})
export class WebsiteTeamModule {}
