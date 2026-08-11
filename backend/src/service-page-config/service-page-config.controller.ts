import { Controller, Get, Put, Param, Body } from '@nestjs/common';
import { ServicePageConfigService } from './service-page-config.service';
import { ServicePageConfigDto } from './dto/service-page-config.dto';

@Controller('service-page-config')
export class ServicePageConfigController {
  constructor(private readonly configService: ServicePageConfigService) {}

  @Get(':slug')
  async getConfig(@Param('slug') slug: string) {
    return this.configService.findByServiceSlug(slug);
  }

  @Put(':slug')
  async updateConfig(
    @Param('slug') slug: string,
    @Body() dto: ServicePageConfigDto
  ) {
    return this.configService.upsert(slug, dto);
  }
}
