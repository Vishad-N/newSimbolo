import { Module } from '@nestjs/common';
import { ServicePageConfigService } from './service-page-config.service';
import { ServicePageConfigController } from './service-page-config.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [ServicePageConfigService],
  controllers: [ServicePageConfigController]
})
export class ServicePageConfigModule {}
