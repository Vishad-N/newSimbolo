import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { BaseService } from '../shared/abstractions/base.service';

@Injectable()
export class TransactionsService extends BaseService {
  constructor(private readonly prisma: PrismaService) {
    super('TransactionsService');
  }

  async findAll(filters: {
    paymentId?: string;
    status?: string;
    type?: string;
    startDate?: Date;
    endDate?: Date;
    page?: number;
    limit?: number;
  }) {
    const { paymentId, status, type, startDate, endDate, page = 1, limit = 20 } = filters;
    const where: any = {};

    if (paymentId) where.paymentId = paymentId;
    if (status) where.status = status;
    if (type) where.type = type;
    if (startDate || endDate) {
      where.createdAt = {};
      if (startDate) where.createdAt.gte = startDate;
      if (endDate) where.createdAt.lte = endDate;
    }

    const [data, total] = await Promise.all([
      this.prisma.transaction.findMany({
        where,
        include: {
          payment: {
            select: {
              paymentNumber: true,
              amount: true,
              currency: true,
              gatewayProvider: true,
              order: {
                select: {
                  orderNumber: true,
                  client: {
                    select: { user: { select: { firstName: true, lastName: true, email: true } } },
                  },
                },
              },
            },
          },
        },
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.transaction.count({ where }),
    ]);

    return { data, meta: { total, page, limit, totalPages: Math.ceil(total / limit) } };
  }

  async findOne(id: string) {
    const transaction = await this.prisma.transaction.findUnique({
      where: { id },
      include: {
        payment: {
          include: {
            order: { include: { client: { include: { user: true } } } },
          },
        },
      },
    });
    if (!transaction) throw new NotFoundException(`Transaction ${id} not found`);
    return transaction;
  }

  async findByPayment(paymentId: string) {
    return this.prisma.transaction.findMany({
      where: { paymentId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getRevenueAnalytics(startDate?: Date, endDate?: Date) {
    const where: any = { status: 'SUCCESS' };
    if (startDate || endDate) {
      where.createdAt = {};
      if (startDate) where.createdAt.gte = startDate;
      if (endDate) where.createdAt.lte = endDate;
    }

    const successfulTransactions = await this.prisma.transaction.findMany({
      where,
      include: { payment: { select: { currency: true } } },
    });

    const totalRevenue = successfulTransactions.reduce((sum, t) => sum + t.amount, 0);
    const totalCount = successfulTransactions.length;

    const byType = successfulTransactions.reduce(
      (acc, t) => {
        acc[t.type] = (acc[t.type] || 0) + t.amount;
        return acc;
      },
      {} as Record<string, number>,
    );

    return {
      totalRevenue,
      totalCount,
      byType,
      currency: 'INR',
    };
  }
}
