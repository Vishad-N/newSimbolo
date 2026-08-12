import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { BaseService } from '../shared/abstractions/base.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { Order, OrderStatusEnum } from '@prisma/client';

@Injectable()
export class OrdersService extends BaseService {
  constructor(private readonly prisma: PrismaService) {
    super('OrdersService');
  }

  private generateOrderNumber(): string {
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = Math.random().toString(36).substring(2, 6).toUpperCase();
    return `ORD-${timestamp}-${random}`;
  }

  private readonly orderInclude = {
    client: {
      include: {
        user: { select: { id: true, firstName: true, lastName: true, email: true } },
        company: { select: { id: true, name: true } },
      },
    },
    package: { select: { id: true, name: true, type: true } },
    service: { select: { id: true, name: true, slug: true } },
    items: true,
    project: { select: { id: true, name: true, status: true, progress: true } },
  };

  async findAll(clientId?: string, status?: OrderStatusEnum, page = 1, limit = 20) {
    const where: any = { deletedAt: null };
    if (clientId) where.clientId = clientId;
    if (status) where.status = status;

    const [data, total] = await Promise.all([
      this.prisma.order.findMany({
        where,
        include: this.orderInclude,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.order.count({ where }),
    ]);

    return { data, meta: { total, page, limit, totalPages: Math.ceil(total / limit) } };
  }

  async findOne(id: string): Promise<Order> {
    const order = await this.prisma.order.findFirst({
      where: { id, deletedAt: null },
      include: {
        ...this.orderInclude,
        payments: { orderBy: { createdAt: 'desc' } },
        invoices: { orderBy: { createdAt: 'desc' } },
        timelines: { orderBy: { date: 'desc' } },
      },
    });
    return this.checkEntityExists(order, 'Order', id);
  }

  async checkout(dto: import('./dto/client-checkout.dto').ClientCheckoutDto, userId: string): Promise<Order> {
    // 1. Get or create ClientProfile for the user
    let client = await this.prisma.clientProfile.findUnique({
      where: { userId },
    });

    if (!client) {
      client = await this.prisma.clientProfile.create({
        data: { userId },
      });
    }

    // 2. Fetch package to get amount
    const pkg = await this.prisma.package.findUnique({
      where: { id: dto.packageId, deletedAt: null },
    });

    if (!pkg) {
      throw new NotFoundException(`Package with ID ${dto.packageId} not found`);
    }

    // 3. Create Order
    return this.prisma.order.create({
      data: {
        orderNumber: this.generateOrderNumber(),
        clientId: client.id,
        packageId: pkg.id,
        serviceId: pkg.serviceId,
        status: OrderStatusEnum.PENDING_PAYMENT,
        totalAmount: pkg.basePrice,
        netAmount: pkg.basePrice,
        currency: 'INR',
      },
    });
  }

  async create(dto: CreateOrderDto, createdBy?: string): Promise<Order> {
    const client = await this.prisma.clientProfile.findFirst({ where: { id: dto.clientId, deletedAt: null } });
    if (!client) throw new NotFoundException(`Client with ID ${dto.clientId} not found`);

    const orderNumber = this.generateOrderNumber();

    const order = await this.prisma.order.create({
      data: {
        orderNumber,
        clientId: dto.clientId,
        packageId: dto.packageId ?? null,
        serviceId: dto.serviceId ?? null,
        totalAmount: dto.totalAmount,
        taxAmount: dto.taxAmount ?? 0.0,
        discountAmount: dto.discountAmount ?? 0.0,
        netAmount: dto.netAmount,
        currency: dto.currency ?? 'INR',
        notes: dto.notes ?? null,
        status: dto.status ?? OrderStatusEnum.PENDING_PAYMENT,
        createdBy: createdBy ?? null,
      },
      include: this.orderInclude,
    });

    // Log activity timeline
    await this.prisma.timeline.create({
      data: {
        title: `Order ${orderNumber} created`,
        description: `New order placed for ₹${dto.netAmount} ${dto.currency ?? 'INR'}`,
        eventType: 'ORDER_CREATED',
        clientId: dto.clientId,
        orderId: order.id,
      },
    });

    return order;
  }

  async update(id: string, dto: UpdateOrderDto, updatedBy?: string): Promise<Order> {
    const existing = await this.findOne(id);

    const updated = await this.prisma.order.update({
      where: { id },
      data: {
        ...(dto.status !== undefined && { status: dto.status }),
        ...(dto.notes !== undefined && { notes: dto.notes }),
        ...(dto.totalAmount !== undefined && { totalAmount: dto.totalAmount }),
        ...(dto.taxAmount !== undefined && { taxAmount: dto.taxAmount }),
        ...(dto.discountAmount !== undefined && { discountAmount: dto.discountAmount }),
        ...(dto.netAmount !== undefined && { netAmount: dto.netAmount }),
        updatedBy: updatedBy ?? null,
      },
      include: this.orderInclude,
    });

    // Log status change activity
    if (dto.status && dto.status !== (existing as any).status) {
      await this.prisma.timeline.create({
        data: {
          title: `Order status changed to ${dto.status}`,
          description: `Order ${(existing as any).orderNumber} transitioned from ${(existing as any).status} to ${dto.status}`,
          eventType: 'ORDER_STATUS_CHANGED',
          clientId: (existing as any).clientId,
          orderId: id,
          userId: updatedBy ?? null,
        },
      });

      // Auto-create project when order is confirmed
      if (dto.status === OrderStatusEnum.CONFIRMED) {
        await this.autoCreateProject(updated as any, updatedBy);
      }
    }

    return updated;
  }

  private async autoCreateProject(order: any, createdBy?: string) {
    const existingProject = await this.prisma.project.findUnique({ where: { orderId: order.id } });
    if (existingProject) return;

    const slug = `project-${order.orderNumber.toLowerCase()}-${Date.now()}`;
    const project = await this.prisma.project.create({
      data: {
        name: `Project for ${order.orderNumber}`,
        slug,
        status: 'PLANNING',
        priority: 'MEDIUM',
        orderId: order.id,
        clientId: order.clientId,
        createdBy: createdBy ?? null,
      },
    });

    await this.prisma.timeline.create({
      data: {
        title: `Project created from confirmed order`,
        description: `Project "${project.name}" was automatically created when order ${order.orderNumber} was confirmed`,
        eventType: 'PROJECT_CREATED_FROM_ORDER',
        clientId: order.clientId,
        orderId: order.id,
      },
    });
  }

  async softDelete(id: string, deletedBy?: string): Promise<{ message: string }> {
    await this.findOne(id);
    await this.prisma.order.update({ where: { id }, data: { deletedAt: new Date(), updatedBy: deletedBy ?? null } });
    return { message: `Order ${id} has been cancelled` };
  }
}
