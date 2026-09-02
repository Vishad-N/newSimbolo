import { Module } from '@nestjs/common';
import { VideoCatalogService } from './video-catalog.service';
import { VideoCatalogController } from './video-catalog.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [VideoCatalogController],
  providers: [VideoCatalogService],
  exports: [VideoCatalogService],
})
export class VideoCatalogModule {}
