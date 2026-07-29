import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { BaseService } from '../shared/abstractions/base.service';
import { EmailService } from '../shared/email/email.service';
import { CreateSubscriptionDto, UpdateSubscriptionDto } from './dto/subscription.dto';
import { SubscriptionStatusEnum, SubscriptionIntervalEnum } from '@prisma/client';

@Injectable()
export class SubscriptionsService extends BaseService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly emailService: EmailService,
  ) {
    super('SubscriptionsService');
  }

  private generateSubscriptionNumber(): string {
    const ts = Date.now().toString(36).toUpperCase();
    const rand = Math.random().toString(36).substring(2, 6).toUpperCase();
    return `SUB-${ts}-${rand}`;
  }

  private computePeriodEnd(start: Date, interval: SubscriptionIntervalEnum): Date {
    const end = new Date(start);
    if (interval === SubscriptionIntervalEnum.MONTHLY) end.setMonth(end.getMonth() + 1);
    else if (interval === SubscriptionIntervalEnum.QUARTERLY) end.setMonth(end.getMonth() + 3);
    else end.setFullYear(end.getFullYear() + 1);
    return end;
  }

  async create(dto: CreateSubscriptionDto, createdBy?: string) {
    const client = await this.prisma.clientProfile.findFirst({
      where: { id: dto.clientId, deletedAt: null },
    });
    if (!client) throw new NotFoundException(`Client ${dto.clientId} not found`);

    const packageRecord = await this.prisma.package.findFirst({
      where: { id: dto.packageId, deletedAt: null },
    });
    if (!packageRecord) throw new NotFoundException(`Package ${dto.packageId} not found`);

    const interval = dto.interval ?? SubscriptionIntervalEnum.MONTHLY;
    const periodStart = dto.currentPeriodStart ? new Date(dto.currentPeriodStart) : new Date();
    const periodEnd = this.computePeriodEnd(periodStart, interval);

    const subscription = await this.prisma.subscription.create({
      data: {
        subscriptionNumber: this.generateSubscriptionNumber(),
        status: SubscriptionStatusEnum.TRIALING,
        interval,
        currentPeriodStart: periodStart,
        currentPeriodEnd: periodEnd,
        clientId: dto.clientId,
        packageId: dto.packageId,
        price: dto.price,
        currency: dto.currency ?? 'INR',
        razorpaySubscriptionId: dto.razorpaySubscriptionId ?? null,
        createdBy: createdBy ?? null,
      },
      include: {
        client: { include: { user: true } },
        package: { select: { id: true, name: true, type: true } },
      },
    });

    this.logger.log(`✅ Subscription created: ${subscription.subscriptionNumber}`);
    return subscription;
  }

  async findAll(clientId?: string, status?: SubscriptionStatusEnum, page = 1, limit = 20) {
    const where: any = { deletedAt: null };
    if (clientId) where.clientId = clientId;
    if (status) where.status = status;

    const [data, total] = await Promise.all([
      this.prisma.subscription.findMany({
        where,
        include: {
          client: { include: { user: { select: { firstName: true, lastName: true, email: true } } } },
          package: { select: { id: true, name: true, type: true, service: { select: { name: true } } } },
          invoices: { select: { id: true, status: true, totalAmount: true }, orderBy: { createdAt: 'desc' }, take: 3 },
        },
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.subscription.count({ where }),
    ]);

    return { data, meta: { total, page, limit, totalPages: Math.ceil(total / limit) } };
  }

  async findOne(id: string) {
    const subscription = await this.prisma.subscription.findFirst({
      where: { id, deletedAt: null },
      include: {
        client: { include: { user: true } },
        package: { include: { service: true, features: true } },
        invoices: { orderBy: { createdAt: 'desc' } },
      },
    });
    if (!subscription) throw new NotFoundException(`Subscription ${id} not found`);
    return subscription;
  }

  async findMySubscriptions(userId: string, page = 1, limit = 20) {
    const client = await this.prisma.clientProfile.findFirst({ where: { userId, deletedAt: null } });
    if (!client) throw new NotFoundException('Client profile not found');
    return this.findAll(client.id, undefined, page, limit);
  }

  async update(id: string, dto: UpdateSubscriptionDto, updatedBy?: string) {
    await this.findOne(id);
    return this.prisma.subscription.update({
      where: { id },
      data: {
        ...(dto.status && { status: dto.status }),
        ...(dto.packageId && { packageId: dto.packageId }),
        ...(dto.price !== undefined && { price: dto.price }),
        ...(dto.cancelAtPeriodEnd !== undefined && { cancelAtPeriodEnd: dto.cancelAtPeriodEnd }),
        updatedBy: updatedBy ?? null,
      },
      include: { client: { include: { user: true } }, package: true },
    });
  }

  async cancel(id: string, immediate = false, cancelledBy?: string) {
    const subscription = await this.findOne(id);
    const client = subscription.client as any;

    if (immediate) {
      return this.prisma.subscription.update({
        where: { id },
        data: { status: SubscriptionStatusEnum.CANCELED, updatedBy: cancelledBy ?? null },
      });
    }

    // Cancel at period end
    const updated = await this.prisma.subscription.update({
      where: { id },
      data: { cancelAtPeriodEnd: true, updatedBy: cancelledBy ?? null },
    });

    await this.emailService.sendSubscriptionRenewalReminder(
      client.user.email,
      `${client.user.firstName} ${client.user.lastName}`,
      (subscription.package as any)?.name ?? 'Subscription',
      subscription.currentPeriodEnd,
      subscription.price,
    );

    return updated;
  }

  async pause(id: string, pausedBy?: string) {
    const sub = await this.findOne(id);
    if (sub.status !== SubscriptionStatusEnum.ACTIVE) {
      throw new BadRequestException('Only ACTIVE subscriptions can be paused');
    }
    return this.prisma.subscription.update({
      where: { id },
      data: { status: SubscriptionStatusEnum.PAUSED, updatedBy: pausedBy ?? null },
    });
  }

  async resume(id: string, resumedBy?: string) {
    const sub = await this.findOne(id);
    if (sub.status !== SubscriptionStatusEnum.PAUSED) {
      throw new BadRequestException('Only PAUSED subscriptions can be resumed');
    }
    return this.prisma.subscription.update({
      where: { id },
      data: { status: SubscriptionStatusEnum.ACTIVE, updatedBy: resumedBy ?? null },
    });
  }

  /**
   * Finds subscriptions expiring within 7 days and sends renewal reminders.
   * Designed to be called by a scheduled job or cron.
   */
  async sendRenewalReminders(): Promise<number> {
    const now = new Date();
    const sevenDaysLater = new Date(now);
    sevenDaysLater.setDate(sevenDaysLater.getDate() + 7);

    const expiringSoon = await this.prisma.subscription.findMany({
      where: {
        status: SubscriptionStatusEnum.ACTIVE,
        cancelAtPeriodEnd: false,
        currentPeriodEnd: { gte: now, lte: sevenDaysLater },
        deletedAt: null,
      },
      include: {
        client: { include: { user: true } },
        package: { select: { name: true } },
      },
    });

    let sent = 0;
    for (const sub of expiringSoon) {
      const client = sub.client as any;
      await this.emailService.sendSubscriptionRenewalReminder(
        client.user.email,
        `${client.user.firstName} ${client.user.lastName}`,
        (sub.package as any)?.name ?? 'Subscription',
        sub.currentPeriodEnd,
        sub.price,
      );
      sent++;
    }

    this.logger.log(`📧 Sent ${sent} subscription renewal reminders`);
    return sent;
  }
}
