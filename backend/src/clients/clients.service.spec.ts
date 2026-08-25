import { BadRequestException, ConflictException, NotFoundException } from '@nestjs/common';
import { ClientsService } from './clients.service';
import { PrismaService } from '../prisma/prisma.service';
import { SubscriptionIntervalEnum } from '@prisma/client';
import { ResourceNotFoundException } from '../common/exceptions/custom.exceptions';

describe('ClientsService', () => {
  let service: ClientsService;
  let prisma: any;

  beforeEach(() => {
    prisma = {
      clientProfile: { findMany: jest.fn(), count: jest.fn(), findFirst: jest.fn(), findUnique: jest.fn(), create: jest.fn(), update: jest.fn() },
      user: { findUnique: jest.fn(), create: jest.fn() },
      company: { findFirst: jest.fn() },
      role: { findUnique: jest.fn() },
      package: { findFirst: jest.fn() },
      timeline: { findMany: jest.fn(), count: jest.fn() },
      project: { count: jest.fn() },
      deliverable: { count: jest.fn() },
      meeting: { count: jest.fn() },
      supportTicket: { count: jest.fn() },
      order: { findMany: jest.fn() },
      $transaction: jest.fn(),
    };
    service = new ClientsService(prisma as unknown as PrismaService);
  });

  describe('findOne / findByUserId', () => {
    it('throws when the client profile does not exist', async () => {
      prisma.clientProfile.findFirst.mockResolvedValue(null);
      await expect(service.findOne('missing-id')).rejects.toBeInstanceOf(ResourceNotFoundException);
    });

    it('throws when looking up a client by a userId with no profile', async () => {
      prisma.clientProfile.findFirst.mockResolvedValue(null);
      await expect(service.findByUserId('user-1')).rejects.toBeInstanceOf(ResourceNotFoundException);
    });
  });

  describe('create', () => {
    it('rejects when the target user does not exist', async () => {
      prisma.user.findUnique.mockResolvedValue(null);
      await expect(service.create({ userId: 'missing' } as any)).rejects.toBeInstanceOf(NotFoundException);
    });

    it('rejects when the user already has a client profile', async () => {
      prisma.user.findUnique.mockResolvedValue({ id: 'user-1' });
      prisma.clientProfile.findUnique.mockResolvedValue({ id: 'existing-profile' });
      await expect(service.create({ userId: 'user-1' } as any)).rejects.toBeInstanceOf(ConflictException);
    });

    it('rejects when the given company does not exist', async () => {
      prisma.user.findUnique.mockResolvedValue({ id: 'user-1' });
      prisma.clientProfile.findUnique.mockResolvedValue(null);
      prisma.company.findFirst.mockResolvedValue(null);
      await expect(service.create({ userId: 'user-1', companyId: 'missing-co' } as any)).rejects.toBeInstanceOf(
        NotFoundException,
      );
    });

    it('creates the client profile with defaults applied', async () => {
      prisma.user.findUnique.mockResolvedValue({ id: 'user-1' });
      prisma.clientProfile.findUnique.mockResolvedValue(null);
      prisma.clientProfile.create.mockResolvedValue({ id: 'client-1' });

      const result = await service.create({ userId: 'user-1' } as any);

      expect(prisma.clientProfile.create).toHaveBeenCalledWith(
        expect.objectContaining({ data: expect.objectContaining({ status: 'ACTIVE', timezone: 'Asia/Kolkata' }) }),
      );
      expect(result).toEqual({ id: 'client-1' });
    });
  });

  describe('createWithUserAndPlan', () => {
    const baseDto = {
      email: 'new@client.com',
      password: 'Password1',
      firstName: 'New',
      lastName: 'Client',
    };

    it('rejects when the email is already registered', async () => {
      prisma.user.findUnique.mockResolvedValue({ id: 'existing-user' });
      await expect(service.createWithUserAndPlan(baseDto as any)).rejects.toBeInstanceOf(ConflictException);
    });

    it('fails clearly if the default CLIENT role has not been seeded', async () => {
      prisma.user.findUnique.mockResolvedValue(null);
      prisma.role.findUnique.mockResolvedValue(null);
      await expect(service.createWithUserAndPlan(baseDto as any)).rejects.toBeInstanceOf(BadRequestException);
    });

    it('rejects when the given package does not exist', async () => {
      prisma.user.findUnique.mockResolvedValue(null);
      prisma.role.findUnique.mockResolvedValue({ id: 'role-client', slug: 'CLIENT' });
      prisma.package.findFirst.mockResolvedValue(null);

      await expect(
        service.createWithUserAndPlan({ ...baseDto, packageId: 'missing-pkg' } as any),
      ).rejects.toBeInstanceOf(NotFoundException);
    });

    it('rejects assigning a package with no positive price available', async () => {
      prisma.user.findUnique.mockResolvedValue(null);
      prisma.role.findUnique.mockResolvedValue({ id: 'role-client', slug: 'CLIENT' });
      prisma.package.findFirst.mockResolvedValue({ id: 'pkg-1', basePrice: 0 });

      await expect(
        service.createWithUserAndPlan({ ...baseDto, packageId: 'pkg-1' } as any),
      ).rejects.toBeInstanceOf(BadRequestException);
    });

    it('creates the user, client profile, and an ACTIVE subscription in one transaction when a package is given', async () => {
      prisma.user.findUnique.mockResolvedValue(null);
      prisma.role.findUnique.mockResolvedValue({ id: 'role-client', slug: 'CLIENT' });
      prisma.package.findFirst.mockResolvedValue({ id: 'pkg-1', basePrice: 999 });

      const tx = {
        user: { create: jest.fn().mockResolvedValue({ id: 'user-1', email: baseDto.email }) },
        clientProfile: { create: jest.fn().mockResolvedValue({ id: 'client-1' }) },
        subscription: { create: jest.fn().mockResolvedValue({ id: 'sub-1', status: 'ACTIVE' }) },
      };
      prisma.$transaction.mockImplementation(async (fn: any) => fn(tx));

      const result = await service.createWithUserAndPlan({
        ...baseDto,
        packageId: 'pkg-1',
        interval: SubscriptionIntervalEnum.MONTHLY,
      } as any);

      expect(tx.user.create).toHaveBeenCalled();
      expect(tx.clientProfile.create).toHaveBeenCalledWith(
        expect.objectContaining({ data: expect.objectContaining({ userId: 'user-1' }) }),
      );
      expect(tx.subscription.create).toHaveBeenCalledWith(
        expect.objectContaining({ data: expect.objectContaining({ clientId: 'client-1', packageId: 'pkg-1', price: 999 }) }),
      );
      expect(result.subscription).toEqual({ id: 'sub-1', status: 'ACTIVE' });
    });

    it('creates the user and client profile with NO subscription when no package is given', async () => {
      prisma.user.findUnique.mockResolvedValue(null);
      prisma.role.findUnique.mockResolvedValue({ id: 'role-client', slug: 'CLIENT' });

      const tx = {
        user: { create: jest.fn().mockResolvedValue({ id: 'user-1', email: baseDto.email }) },
        clientProfile: { create: jest.fn().mockResolvedValue({ id: 'client-1' }) },
        subscription: { create: jest.fn() },
      };
      prisma.$transaction.mockImplementation(async (fn: any) => fn(tx));

      const result = await service.createWithUserAndPlan(baseDto as any);

      expect(tx.subscription.create).not.toHaveBeenCalled();
      expect(result.subscription).toBeNull();
    });
  });

  describe('update', () => {
    it('rejects updating to a nonexistent company', async () => {
      prisma.clientProfile.findFirst.mockResolvedValue({ id: 'client-1' });
      prisma.company.findFirst.mockResolvedValue(null);

      await expect(service.update('client-1', { companyId: 'missing-co' } as any)).rejects.toBeInstanceOf(
        NotFoundException,
      );
    });

    it('applies only the provided fields', async () => {
      prisma.clientProfile.findFirst.mockResolvedValue({ id: 'client-1' });
      prisma.clientProfile.update.mockResolvedValue({ id: 'client-1', notes: 'VIP' });

      await service.update('client-1', { notes: 'VIP' } as any, 'admin-1');

      expect(prisma.clientProfile.update).toHaveBeenCalledWith(
        expect.objectContaining({ where: { id: 'client-1' }, data: expect.objectContaining({ notes: 'VIP', updatedBy: 'admin-1' }) }),
      );
    });
  });

  describe('softDelete', () => {
    it('marks the client profile as deactivated rather than removing it', async () => {
      prisma.clientProfile.findFirst.mockResolvedValue({ id: 'client-1' });
      prisma.clientProfile.update.mockResolvedValue({});

      const result = await service.softDelete('client-1', 'admin-1');

      expect(prisma.clientProfile.update).toHaveBeenCalledWith({
        where: { id: 'client-1' },
        data: { deletedAt: expect.any(Date), updatedBy: 'admin-1' },
      });
      expect(result.message).toContain('client-1');
    });
  });

  describe('getClientDashboard', () => {
    it('aggregates counts and recent orders for the client', async () => {
      prisma.clientProfile.findFirst.mockResolvedValue({ id: 'client-1' });
      prisma.project.count.mockResolvedValue(2);
      prisma.deliverable.count.mockResolvedValue(1);
      prisma.meeting.count.mockResolvedValue(0);
      prisma.supportTicket.count.mockResolvedValue(3);
      prisma.order.findMany.mockResolvedValue([{ id: 'order-1' }]);

      const result = await service.getClientDashboard('client-1');

      expect(result).toEqual({
        activeProjects: 2,
        pendingDeliverables: 1,
        upcomingMeetings: 0,
        openTickets: 3,
        recentOrders: [{ id: 'order-1' }],
      });
    });
  });
});
