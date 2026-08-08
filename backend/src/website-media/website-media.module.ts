import { Module } from '@nestjs/common';
import { WebsiteMediaController } from './website-media.controller';
import { WebsiteMediaService } from './website-media.service';

@Module({
  controllers: [WebsiteMediaController],
  providers: [WebsiteMediaService],
  exports: [WebsiteMediaService],
})
export class WebsiteMediaModule {}
