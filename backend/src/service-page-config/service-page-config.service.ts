import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ServicePageConfigDto } from './dto/service-page-config.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class ServicePageConfigService {
  constructor(private readonly prisma: PrismaService) {}

  async findByServiceSlug(slug: string) {
    const service = await this.prisma.service.findUnique({
      where: { slug },
      select: { id: true }
    });

    if (!service) {
      throw new NotFoundException(`Service with slug ${slug} not found`);
    }

    return this.prisma.servicePageConfig.findUnique({
      where: { serviceId: service.id }
    });
  }

  async upsert(slug: string, dto: ServicePageConfigDto) {
    const service = await this.prisma.service.findUnique({
      where: { slug },
      select: { id: true }
    });

    if (!service) {
      throw new NotFoundException(`Service with slug ${slug} not found`);
    }

    const data: Prisma.ServicePageConfigUpdateInput = {
      heroBenefits: dto.heroBenefits || undefined,
      statsBar: dto.statsBar || undefined,
      servicesList: dto.servicesList || undefined,
      resultMetrics: dto.resultMetrics || undefined,
    };

    return this.prisma.servicePageConfig.upsert({
      where: { serviceId: service.id },
      update: data,
      create: {
        service: { connect: { id: service.id } },
        heroBenefits: dto.heroBenefits || [],
        statsBar: dto.statsBar || [],
        servicesList: dto.servicesList || [],
        resultMetrics: dto.resultMetrics || [],
      }
    });
  }
}
