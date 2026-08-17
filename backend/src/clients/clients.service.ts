import { Injectable, NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { BaseService } from '../shared/abstractions/base.service';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { CreateClientWithPlanDto } from './dto/create-client-with-plan.dto';
import { ClientProfile, SubscriptionIntervalEnum, SubscriptionStatusEnum, UserStatusEnum } from '@prisma/client';
import * as bcrypt from 'bcrypt';

@Injectable()
export class ClientsService extends BaseService {
  constructor(private readonly prisma: PrismaService) {
    super('ClientsService');
  }

  private readonly clientInclude = {
    user: {
      select: { id: true, firstName: true, lastName: true, email: true, countryCode: true, phone: true, avatarUrl: true, status: true },
    },
    company: {
      select: { id: true, name: true, slug: true, industry: true, logoUrl: true },
    },
    accountManager: {
      select: { id: true, firstName: true, lastName: true, email: true },
    },
    _count: {
      select: { orders: true, projects: true, supportTickets: true },
    },
  };

  async findAll(search?: string, status?: string, companyId?: string, accountManagerId?: string, page = 1, limit = 20) {
    const where: any = { deletedAt: null };

    if (status) where.status = status;
    if (companyId) where.companyId = companyId;
    if (accountManagerId) where.accountManagerId = accountManagerId;
    if (search) {
      where.OR = [
        { user: { firstName: { contains: search, mode: 'insensitive' } } },
        { user: { lastName: { contains: search, mode: 'insensitive' } } },
        { user: { email: { contains: search, mode: 'insensitive' } } },
        { company: { name: { contains: search, mode: 'insensitive' } } },
      ];
    }

    const [data, total] = await Promise.all([
      this.prisma.clientProfile.findMany({
        where,
        include: this.clientInclude,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.clientProfile.count({ where }),
    ]);

    return {
      data,
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    };
  }

  async findOne(id: string): Promise<ClientProfile> {
    const client = await this.prisma.clientProfile.findFirst({
      where: { id, deletedAt: null },
      include: {
        ...this.clientInclude,
        orders: {
          orderBy: { createdAt: 'desc' },
          take: 5,
          select: { id: true, orderNumber: true, status: true, totalAmount: true, currency: true, createdAt: true },
        },
        projects: {
          orderBy: { createdAt: 'desc' },
          take: 5,
          select: { id: true, name: true, status: true, progress: true, targetEndDate: true },
        },
        supportTickets: {
          orderBy: { createdAt: 'desc' },
          take: 5,
          select: { id: true, ticketNumber: true, subject: true, status: true, priority: true, createdAt: true },
        },
        timelines: {
          orderBy: { date: 'desc' },
          take: 20,
        },
        meetings: {
          where: { startTime: { gte: new Date() } },
          orderBy: { startTime: 'asc' },
          take: 3,
        },
      },
    });
    return this.checkEntityExists(client, 'ClientProfile', id);
  }

  async findByUserId(userId: string): Promise<ClientProfile> {
    const client = await this.prisma.clientProfile.findFirst({
      where: { userId, deletedAt: null },
      include: this.clientInclude,
    });
    return this.checkEntityExists(client, 'ClientProfile', `userId:${userId}`);
  }

  async create(dto: CreateClientDto, createdBy?: string): Promise<ClientProfile> {
    // Verify user exists and doesn't already have a client profile
    const user = await this.prisma.user.findUnique({ where: { id: dto.userId } });
    if (!user) throw new NotFoundException(`User with ID ${dto.userId} not found`);

    const existing = await this.prisma.clientProfile.findUnique({ where: { userId: dto.userId } });
    if (existing) throw new ConflictException(`A client profile already exists for user ${dto.userId}`);

    // Validate company if provided
    if (dto.companyId) {
      const company = await this.prisma.company.findFirst({ where: { id: dto.companyId, deletedAt: null } });
      if (!company) throw new NotFoundException(`Company with ID ${dto.companyId} not found`);
    }

    // Validate account manager if provided
    if (dto.accountManagerId) {
      const manager = await this.prisma.user.findUnique({ where: { id: dto.accountManagerId } });
      if (!manager) throw new NotFoundException(`Account Manager with ID ${dto.accountManagerId} not found`);
    }

    return this.prisma.clientProfile.create({
      data: {
        userId: dto.userId,
        companyId: dto.companyId ?? null,
        accountManagerId: dto.accountManagerId ?? null,
        gstNumber: dto.gstNumber ?? null,
        billingAddress: dto.billingAddress ?? null,
        timezone: dto.timezone ?? 'Asia/Kolkata',
        notes: dto.notes ?? null,
        status: 'ACTIVE',
        createdBy: createdBy ?? null,
      },
      include: this.clientInclude,
    });
  }

  async createWithUserAndPlan(dto: CreateClientWithPlanDto, createdBy?: string) {
    const existingUser = await this.prisma.user.findUnique({ where: { email: dto.email } });
    if (existingUser) {
      throw new ConflictException('A user with this email address already exists');
    }

    const clientRole = await this.prisma.role.findUnique({ where: { slug: 'CLIENT' } });
    if (!clientRole) {
      throw new BadRequestException('Default CLIENT role is not initialized in system. Please run database seeding.');
    }

    const packageRecord = dto.packageId
      ? await this.prisma.package.findFirst({ where: { id: dto.packageId, deletedAt: null } })
      : null;

    if (dto.packageId && !packageRecord) {
      throw new NotFoundException(`Package with ID ${dto.packageId} not found`);
    }

    if (dto.companyId) {
      const company = await this.prisma.company.findFirst({ where: { id: dto.companyId, deletedAt: null } });
      if (!company) throw new NotFoundException(`Company with ID ${dto.companyId} not found`);
    }

    if (dto.accountManagerId) {
      const manager = await this.prisma.user.findUnique({ where: { id: dto.accountManagerId } });
      if (!manager) throw new NotFoundException(`Account Manager with ID ${dto.accountManagerId} not found`);
    }

    const passwordHash = await bcrypt.hash(dto.password, 12);
    const interval = dto.interval ?? SubscriptionIntervalEnum.MONTHLY;
    const periodStart = dto.currentPeriodStart ? new Date(dto.currentPeriodStart) : new Date();
    const periodEnd = this.computeSubscriptionPeriodEnd(periodStart, interval);
    const subscriptionPrice = dto.price ?? packageRecord?.basePrice;

    if (dto.packageId && (!subscriptionPrice || subscriptionPrice <= 0)) {
      throw new BadRequestException('A positive subscription price is required when assigning a package.');
    }

    return this.prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          email: dto.email,
          passwordHash,
          firstName: dto.firstName,
          lastName: dto.lastName,
          countryCode: dto.countryCode,
          phone: dto.phone,
          status: UserStatusEnum.ACTIVE,
          roleId: clientRole.id,
          createdBy,
        },
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          countryCode: true,
          phone: true,
          status: true,
          role: { select: { id: true, name: true, slug: true } },
        },
      });

      const client = await tx.clientProfile.create({
        data: {
          userId: user.id,
          companyId: dto.companyId ?? null,
          accountManagerId: dto.accountManagerId ?? null,
          gstNumber: dto.gstNumber ?? null,
          billingAddress: dto.billingAddress ?? null,
          timezone: dto.timezone ?? 'Asia/Kolkata',
          notes: dto.notes ?? null,
          status: 'ACTIVE',
          createdBy: createdBy ?? null,
        },
        include: this.clientInclude,
      });

      const subscription =
        dto.packageId && subscriptionPrice
          ? await tx.subscription.create({
              data: {
                subscriptionNumber: this.generateSubscriptionNumber(),
                status: SubscriptionStatusEnum.ACTIVE,
                interval,
                currentPeriodStart: periodStart,
                currentPeriodEnd: periodEnd,
                clientId: client.id,
                packageId: dto.packageId,
                price: subscriptionPrice,
                currency: dto.currency ?? 'INR',
                createdBy: createdBy ?? null,
              },
              include: {
                package: { select: { id: true, name: true, type: true, basePrice: true } },
              },
            })
          : null;

      return { user, client, subscription };
    });
  }

  async update(id: string, dto: UpdateClientDto, updatedBy?: string): Promise<ClientProfile> {
    await this.findOne(id); // validates existence

    if (dto.companyId) {
      const company = await this.prisma.company.findFirst({ where: { id: dto.companyId, deletedAt: null } });
      if (!company) throw new NotFoundException(`Company with ID ${dto.companyId} not found`);
    }

    if (dto.accountManagerId) {
      const manager = await this.prisma.user.findUnique({ where: { id: dto.accountManagerId } });
      if (!manager) throw new NotFoundException(`Account Manager with ID ${dto.accountManagerId} not found`);
    }

    return this.prisma.clientProfile.update({
      where: { id },
      data: {
        ...(dto.companyId !== undefined && { companyId: dto.companyId }),
        ...(dto.accountManagerId !== undefined && { accountManagerId: dto.accountManagerId }),
        ...(dto.gstNumber !== undefined && { gstNumber: dto.gstNumber }),
        ...(dto.billingAddress !== undefined && { billingAddress: dto.billingAddress }),
        ...(dto.timezone !== undefined && { timezone: dto.timezone }),
        ...(dto.notes !== undefined && { notes: dto.notes }),
        ...(dto.status !== undefined && { status: dto.status }),
        updatedBy: updatedBy ?? null,
      },
      include: this.clientInclude,
    });
  }

  async softDelete(id: string, deletedBy?: string): Promise<{ message: string }> {
    await this.findOne(id);
    await this.prisma.clientProfile.update({
      where: { id },
      data: { deletedAt: new Date(), updatedBy: deletedBy ?? null },
    });
    return { message: `Client profile ${id} has been deactivated` };
  }

  private generateSubscriptionNumber(): string {
    const timestamp = Date.now().toString(36).toUpperCase();
    const randomSuffix = Math.random().toString(36).substring(2, 6).toUpperCase();
    return `SUB-${timestamp}-${randomSuffix}`;
  }

  private computeSubscriptionPeriodEnd(start: Date, interval: SubscriptionIntervalEnum): Date {
    const end = new Date(start);
    if (interval === SubscriptionIntervalEnum.MONTHLY) end.setMonth(end.getMonth() + 1);
    else if (interval === SubscriptionIntervalEnum.QUARTERLY) end.setMonth(end.getMonth() + 3);
    else end.setFullYear(end.getFullYear() + 1);
    return end;
  }

  async getClientTimeline(clientId: string, page = 1, limit = 30) {
    await this.findOne(clientId);
    const [data, total] = await Promise.all([
      this.prisma.timeline.findMany({
        where: { clientId },
        orderBy: { date: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.timeline.count({ where: { clientId } }),
    ]);
    return { data, meta: { total, page, limit, totalPages: Math.ceil(total / limit) } };
  }

  async getClientDashboard(clientId: string) {
    await this.findOne(clientId);

    const [activeProjects, pendingDeliverables, upcomingMeetings, openTickets, recentOrders] = await Promise.all([
      this.prisma.project.count({
        where: { clientId, status: { in: ['PLANNING', 'ACTIVE', 'IN_PROGRESS'] }, deletedAt: null },
      }),
      this.prisma.deliverable.count({
        where: { project: { clientId }, status: { in: ['PENDING', 'SUBMITTED'] }, deletedAt: null },
      }),
      this.prisma.meeting.count({ where: { clientId, startTime: { gte: new Date() }, deletedAt: null } }),
      this.prisma.supportTicket.count({
        where: { clientId, status: { in: ['OPEN', 'IN_PROGRESS'] }, deletedAt: null },
      }),
      this.prisma.order.findMany({
        where: { clientId, deletedAt: null },
        orderBy: { createdAt: 'desc' },
        take: 5,
        select: { id: true, orderNumber: true, status: true, totalAmount: true, currency: true, createdAt: true },
      }),
    ]);

    return { activeProjects, pendingDeliverables, upcomingMeetings, openTickets, recentOrders };
  }
}
