import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { BaseService } from '../shared/abstractions/base.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { Company } from '@prisma/client';

@Injectable()
export class CompaniesService extends BaseService {
  constructor(private readonly prisma: PrismaService) {
    super('CompaniesService');
  }

  private generateSlug(text: string): string {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }

  private readonly companyInclude = {
    clients: {
      where: { deletedAt: null },
      include: {
        user: { select: { id: true, firstName: true, lastName: true, email: true } },
      },
    },
    _count: { select: { clients: true, documents: true } },
  };

  async findAll(search?: string, industry?: string, page = 1, limit = 20) {
    const where: any = { deletedAt: null };
    if (industry) where.industry = industry;
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { industry: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [data, total] = await Promise.all([
      this.prisma.company.findMany({
        where,
        include: { _count: { select: { clients: true } } },
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { name: 'asc' },
      }),
      this.prisma.company.count({ where }),
    ]);

    return { data, meta: { total, page, limit, totalPages: Math.ceil(total / limit) } };
  }

  async findOne(id: string): Promise<Company> {
    const company = await this.prisma.company.findFirst({
      where: { id, deletedAt: null },
      include: this.companyInclude,
    });
    return this.checkEntityExists(company, 'Company', id);
  }

  async findBySlug(slug: string): Promise<Company> {
    const company = await this.prisma.company.findFirst({
      where: { slug, deletedAt: null },
      include: this.companyInclude,
    });
    return this.checkEntityExists(company, 'Company', slug);
  }

  async create(dto: CreateCompanyDto, createdBy?: string): Promise<Company> {
    const slug = this.generateSlug(dto.name);
    const existing = await this.prisma.company.findUnique({ where: { slug } });
    if (existing) throw new ConflictException(`A company with the name "${dto.name}" already exists`);

    return this.prisma.company.create({
      data: {
        name: dto.name,
        slug,
        website: dto.website ?? null,
        industry: dto.industry ?? null,
        size: dto.size ?? null,
        logoUrl: dto.logoUrl ?? null,
        gstNumber: dto.gstNumber ?? null,
        billingAddress: dto.billingAddress ?? null,
        createdBy: createdBy ?? null,
      },
      include: this.companyInclude,
    });
  }

  async update(id: string, dto: UpdateCompanyDto, updatedBy?: string): Promise<Company> {
    await this.findOne(id);

    if (dto.name) {
      const slug = this.generateSlug(dto.name);
      const existing = await this.prisma.company.findFirst({ where: { slug, NOT: { id } } });
      if (existing) throw new ConflictException(`A company with the name "${dto.name}" already exists`);
    }

    return this.prisma.company.update({
      where: { id },
      data: {
        ...(dto.name && { name: dto.name, slug: this.generateSlug(dto.name) }),
        ...(dto.website !== undefined && { website: dto.website }),
        ...(dto.industry !== undefined && { industry: dto.industry }),
        ...(dto.size !== undefined && { size: dto.size }),
        ...(dto.logoUrl !== undefined && { logoUrl: dto.logoUrl }),
        ...(dto.gstNumber !== undefined && { gstNumber: dto.gstNumber }),
        ...(dto.billingAddress !== undefined && { billingAddress: dto.billingAddress }),
        updatedBy: updatedBy ?? null,
      },
      include: this.companyInclude,
    });
  }

  async softDelete(id: string, deletedBy?: string): Promise<{ message: string }> {
    await this.findOne(id);
    await this.prisma.company.update({ where: { id }, data: { deletedAt: new Date(), updatedBy: deletedBy ?? null } });
    return { message: `Company ${id} has been deleted` };
  }
}
