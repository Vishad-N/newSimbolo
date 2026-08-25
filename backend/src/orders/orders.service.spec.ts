import { NotFoundException } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { PrismaService } from '../prisma/prisma.service';
import { OrderStatusEnum } from '@prisma/client';
import { ResourceNotFoundException } from '../common/exceptions/custom.exceptions';

describe('OrdersService', () => {
  let service: OrdersService;
  let prisma: any;

  beforeEach(() => {
    prisma = {
      order: { findMany: jest.fn(), count: jest.fn(), findFirst: jest.fn(), create: jest.fn(), update: jest.fn() },
      clientProfile: { findUnique: jest.fn(), create: jest.fn(), findFirst: jest.fn() },
      package: { findUnique: jest.fn() },
      timeline: { create: jest.fn() },
      project: { findUnique: jest.fn(), create: jest.fn() },
    };
    service = new OrdersService(prisma as unknown as PrismaService);
  });

  describe('findAll', () => {
    it('returns paginated results scoped to the given filters', async () => {
      prisma.order.findMany.mockResolvedValue([{ id: 'order-1' }]);
      prisma.order.count.mockResolvedValue(1);

      const result = await service.findAll('client-1', OrderStatusEnum.CONFIRMED, 2, 10);

      expect(prisma.order.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { deletedAt: null, clientId: 'client-1', status: OrderStatusEnum.CONFIRMED },
          skip: 10,
          take: 10,
        }),
      );
      expect(result).toEqual({ data: [{ id: 'order-1' }], meta: { total: 1, page: 2, limit: 10, totalPages: 1 } });
    });
  });

  describe('findOne', () => {
    it('throws when the order does not exist (or is soft-deleted)', async () => {
      prisma.order.findFirst.mockResolvedValue(null);

      await expect(service.findOne('missing-id')).rejects.toBeInstanceOf(ResourceNotFoundException);
    });

    it('returns the order when found', async () => {
      prisma.order.findFirst.mockResolvedValue({ id: 'order-1' });

      await expect(service.findOne('order-1')).resolves.toEqual({ id: 'order-1' });
    });
  });

  describe('checkout', () => {
    it('creates a ClientProfile for a first-time buyer', async () => {
      prisma.clientProfile.findUnique.mockResolvedValue(null);
      prisma.clientProfile.create.mockResolvedValue({ id: 'client-1', userId: 'user-1' });
      prisma.package.findUnique.mockResolvedValue({ id: 'pkg-1', serviceId: 'svc-1', basePrice: 999 });
      prisma.order.create.mockResolvedValue({ id: 'order-1' });

      await service.checkout({ packageId: 'pkg-1' } as any, 'user-1');

      expect(prisma.clientProfile.create).toHaveBeenCalledWith({ data: { userId: 'user-1' } });
      expect(prisma.order.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({ clientId: 'client-1', packageId: 'pkg-1', totalAmount: 999 }),
        }),
      );
    });

    it('reuses an existing ClientProfile instead of creating a duplicate', async () => {
      prisma.clientProfile.findUnique.mockResolvedValue({ id: 'client-existing', userId: 'user-1' });
      prisma.package.findUnique.mockResolvedValue({ id: 'pkg-1', serviceId: 'svc-1', basePrice: 500 });
      prisma.order.create.mockResolvedValue({ id: 'order-1' });

      await service.checkout({ packageId: 'pkg-1' } as any, 'user-1');

      expect(prisma.clientProfile.create).not.toHaveBeenCalled();
      expect(prisma.order.create).toHaveBeenCalledWith(
        expect.objectContaining({ data: expect.objectContaining({ clientId: 'client-existing' }) }),
      );
    });

    it('rejects checkout for a package that does not exist', async () => {
      prisma.clientProfile.findUnique.mockResolvedValue({ id: 'client-1', userId: 'user-1' });
      prisma.package.findUnique.mockResolvedValue(null);

      await expect(service.checkout({ packageId: 'missing-pkg' } as any, 'user-1')).rejects.toBeInstanceOf(
        NotFoundException,
      );
      expect(prisma.order.create).not.toHaveBeenCalled();
    });
  });

  describe('create', () => {
    it('rejects an order for a client that does not exist', async () => {
      prisma.clientProfile.findFirst.mockResolvedValue(null);

      await expect(
        service.create({ clientId: 'missing-client', totalAmount: 100, netAmount: 100 } as any),
      ).rejects.toBeInstanceOf(NotFoundException);
      expect(prisma.order.create).not.toHaveBeenCalled();
    });

    it('creates the order and logs a timeline entry', async () => {
      prisma.clientProfile.findFirst.mockResolvedValue({ id: 'client-1' });
      prisma.order.create.mockResolvedValue({ id: 'order-1', orderNumber: 'ORD-1' });
      prisma.timeline.create.mockResolvedValue({});

      const result = await service.create({ clientId: 'client-1', totalAmount: 100, netAmount: 100 } as any);

      expect(prisma.timeline.create).toHaveBeenCalledWith(
        expect.objectContaining({ data: expect.objectContaining({ eventType: 'ORDER_CREATED', clientId: 'client-1' }) }),
      );
      expect(result).toEqual({ id: 'order-1', orderNumber: 'ORD-1' });
    });
  });

  describe('update', () => {
    it('logs a status-change timeline entry only when the status actually changes', async () => {
      prisma.order.findFirst.mockResolvedValue({ id: 'order-1', status: OrderStatusEnum.PENDING_PAYMENT });
      prisma.order.update.mockResolvedValue({ id: 'order-1', status: OrderStatusEnum.PENDING_PAYMENT });

      await service.update('order-1', { notes: 'just a note' } as any);

      expect(prisma.timeline.create).not.toHaveBeenCalled();
    });

    it('auto-creates a project when an order transitions to CONFIRMED', async () => {
      prisma.order.findFirst.mockResolvedValue({ id: 'order-1', status: OrderStatusEnum.PENDING_PAYMENT });
      prisma.order.update.mockResolvedValue({
        id: 'order-1',
        orderNumber: 'ORD-1',
        clientId: 'client-1',
        status: OrderStatusEnum.CONFIRMED,
      });
      prisma.timeline.create.mockResolvedValue({});
      prisma.project.findUnique.mockResolvedValue(null);
      prisma.project.create.mockResolvedValue({ id: 'project-1', name: 'Project for ORD-1' });

      await service.update('order-1', { status: OrderStatusEnum.CONFIRMED } as any);

      expect(prisma.project.create).toHaveBeenCalledWith(
        expect.objectContaining({ data: expect.objectContaining({ orderId: 'order-1', clientId: 'client-1' }) }),
      );
    });

    it('does not create a second project if one already exists for the order', async () => {
      prisma.order.findFirst.mockResolvedValue({ id: 'order-1', status: OrderStatusEnum.PENDING_PAYMENT });
      prisma.order.update.mockResolvedValue({
        id: 'order-1',
        orderNumber: 'ORD-1',
        clientId: 'client-1',
        status: OrderStatusEnum.CONFIRMED,
      });
      prisma.timeline.create.mockResolvedValue({});
      prisma.project.findUnique.mockResolvedValue({ id: 'existing-project' });

      await service.update('order-1', { status: OrderStatusEnum.CONFIRMED } as any);

      expect(prisma.project.create).not.toHaveBeenCalled();
    });
  });

  describe('softDelete', () => {
    it('marks the order as deleted rather than removing it', async () => {
      prisma.order.findFirst.mockResolvedValue({ id: 'order-1' });
      prisma.order.update.mockResolvedValue({});

      const result = await service.softDelete('order-1', 'admin-1');

      expect(prisma.order.update).toHaveBeenCalledWith({
        where: { id: 'order-1' },
        data: { deletedAt: expect.any(Date), updatedBy: 'admin-1' },
      });
      expect(result.message).toContain('order-1');
    });
  });
});
