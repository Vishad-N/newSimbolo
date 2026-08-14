import { Injectable } from '@nestjs/common';
import { BaseService } from '../shared/abstractions/base.service';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePackageDto } from './dto/create-package.dto';
import { UpdatePackageDto } from './dto/update-package.dto';
import { CreatePackageFeatureDto } from './dto/create-package-feature.dto';
import { PackagePricingDto } from './dto/package-pricing.dto';
import { Package, PackageFeature, PackagePricing, PackageTypeEnum } from '@prisma/client';
import { CustomConflictException } from '../common/exceptions/custom.exceptions';

@Injectable()
export class PackagesService extends BaseService {
  constructor(private readonly prisma: PrismaService) {
    super('PackagesService');
  }

  private generateSlug(text: string): string {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }

  async getPackages(serviceId?: string, type?: PackageTypeEnum): Promise<Package[]> {
    const where: any = { deletedAt: null };
    if (serviceId) {
      where.serviceId = serviceId;
    }
    if (type) {
      where.type = type;
    }
    return this.prisma.package.findMany({
      where,
      include: {
        service: { select: { id: true, name: true, slug: true } },
        features: { orderBy: { sortOrder: 'asc' } },
        pricings: true,
        comparisons: { orderBy: { sortOrder: 'asc' } },
      },
      orderBy: { basePrice: 'asc' },
    });
  }

  async getPackageBySlug(slug: string): Promise<Package> {
    const pkg = await this.prisma.package.findUnique({
      where: { slug },
      include: {
        service: true,
        features: { orderBy: { sortOrder: 'asc' } },
        pricings: true,
        comparisons: { orderBy: { sortOrder: 'asc' } },
      },
    });
    return this.checkEntityExists(pkg, 'Package', slug);
  }

  async createPackage(dto: CreatePackageDto, createdBy?: string): Promise<Package> {
    const slug = this.generateSlug(dto.name);
    const existing = await this.prisma.package.findUnique({ where: { slug } });
    if (existing) {
      throw new CustomConflictException(`Package with name "${dto.name}" or slug "${slug}" already exists`);
    }

    const service = await this.prisma.service.findUnique({ where: { id: dto.serviceId } });
    this.checkEntityExists(service, 'Service', dto.serviceId);

    const created = await this.prisma.package.create({
      data: {
        name: dto.name,
        slug,
        description: dto.description || null,
        type: dto.type || 'STARTER',
        serviceId: dto.serviceId,
        basePrice: dto.basePrice !== undefined ? dto.basePrice : 0.0,
        billingInterval: dto.billingInterval || 'monthly',
        isPopular: dto.isPopular !== undefined ? dto.isPopular : false,
        isAddon: dto.isAddon !== undefined ? dto.isAddon : false,
        isCustom: dto.isCustom !== undefined ? dto.isCustom : false,
        createdBy: createdBy || null,
      },
    });

    this.logger.log(`Created package "${created.name}" (ID: ${created.id})`);
    return created;
  }

  async updatePackage(id: string, dto: UpdatePackageDto, updatedBy?: string): Promise<Package> {
    const pkg = this.checkEntityExists(await this.prisma.package.findUnique({ where: { id } }), 'Package', id);

    if (dto.serviceId && dto.serviceId !== pkg.serviceId) {
      const service = await this.prisma.service.findUnique({ where: { id: dto.serviceId } });
      this.checkEntityExists(service, 'Service', dto.serviceId);
    }

    let slug = pkg.slug;
    if (dto.name && dto.name !== pkg.name) {
      slug = this.generateSlug(dto.name);
      const conflict = await this.prisma.package.findFirst({
        where: { slug, id: { not: id } },
      });
      if (conflict) {
        throw new CustomConflictException(`Package name "${dto.name}" already exists`);
      }
    }

    return this.prisma.package.update({
      where: { id },
      data: {
        ...(dto.name !== undefined && { name: dto.name, slug }),
        ...(dto.description !== undefined && { description: dto.description }),
        ...(dto.type !== undefined && { type: dto.type }),
        ...(dto.serviceId !== undefined && { serviceId: dto.serviceId }),
        ...(dto.basePrice !== undefined && { basePrice: dto.basePrice }),
        ...(dto.billingInterval !== undefined && { billingInterval: dto.billingInterval }),
        ...(dto.isPopular !== undefined && { isPopular: dto.isPopular }),
        ...(dto.isAddon !== undefined && { isAddon: dto.isAddon }),
        ...(dto.isCustom !== undefined && { isCustom: dto.isCustom }),
        updatedBy: updatedBy || null,
      },
    });
  }

  async deletePackage(id: string, deletedBy?: string): Promise<{ success: boolean }> {
    const pkg = await this.prisma.package.findUnique({ where: { id } });
    this.checkEntityExists(pkg, 'Package', id);
    await this.prisma.package.update({
      where: { id },
      data: { deletedAt: new Date(), updatedBy: deletedBy || null },
    });
    this.logger.log(`Soft-deleted package ID: ${id}`);
    return { success: true };
  }

  // Features CRUD
  async addFeature(dto: CreatePackageFeatureDto): Promise<PackageFeature> {
    const pkg = await this.prisma.package.findUnique({ where: { id: dto.packageId } });
    this.checkEntityExists(pkg, 'Package', dto.packageId);
    return this.prisma.packageFeature.create({
      data: {
        name: dto.name,
        description: dto.description || null,
        packageId: dto.packageId,
        isIncluded: dto.isIncluded !== undefined ? dto.isIncluded : true,
        limitValue: dto.limitValue || null,
        sortOrder: dto.sortOrder !== undefined ? dto.sortOrder : 0,
      },
    });
  }

  async deleteFeature(id: string): Promise<{ success: boolean }> {
    const feat = await this.prisma.packageFeature.findUnique({ where: { id } });
    this.checkEntityExists(feat, 'PackageFeature', id);
    await this.prisma.packageFeature.delete({ where: { id } });
    return { success: true };
  }

  // Pricings CRUD
  async upsertPricing(dto: PackagePricingDto): Promise<PackagePricing> {
    const pkg = await this.prisma.package.findUnique({ where: { id: dto.packageId } });
    this.checkEntityExists(pkg, 'Package', dto.packageId);
    const currency = dto.currency || 'INR';
    const billingPeriod = dto.billingPeriod || 'monthly';

    return this.prisma.packagePricing.upsert({
      where: {
        packageId_currency_billingPeriod: {
          packageId: dto.packageId,
          currency,
          billingPeriod,
        },
      },
      create: {
        packageId: dto.packageId,
        currency,
        price: dto.price,
        billingPeriod,
        discountPercentage: dto.discountPercentage !== undefined ? dto.discountPercentage : 0.0,
      },
      update: {
        price: dto.price,
        ...(dto.discountPercentage !== undefined && { discountPercentage: dto.discountPercentage }),
      },
    });
  }

  async deletePricing(id: string): Promise<{ success: boolean }> {
    const pricing = await this.prisma.packagePricing.findUnique({ where: { id } });
    this.checkEntityExists(pricing, 'PackagePricing', id);
    await this.prisma.packagePricing.delete({ where: { id } });
    return { success: true };
  }
}
