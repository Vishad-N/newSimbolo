import { ConflictException, NotFoundException } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { PrismaService } from '../prisma/prisma.service';
import { ProjectStatusEnum } from '@prisma/client';
import { ResourceNotFoundException } from '../common/exceptions/custom.exceptions';

describe('ProjectsService', () => {
  let service: ProjectsService;
  let prisma: any;

  beforeEach(() => {
    prisma = {
      project: { findMany: jest.fn(), count: jest.fn(), findFirst: jest.fn(), findUnique: jest.fn(), create: jest.fn(), update: jest.fn() },
      order: { findFirst: jest.fn() },
      clientProfile: { findFirst: jest.fn() },
      timeline: { create: jest.fn() },
      task: { findMany: jest.fn() },
    };
    service = new ProjectsService(prisma as unknown as PrismaService);
  });

  describe('findAll', () => {
    it('returns paginated results scoped to the given filters', async () => {
      prisma.project.findMany.mockResolvedValue([{ id: 'project-1' }]);
      prisma.project.count.mockResolvedValue(1);

      const result = await service.findAll('client-1', ProjectStatusEnum.PLANNING, 'manager-1', 1, 20);

      expect(prisma.project.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { deletedAt: null, clientId: 'client-1', status: ProjectStatusEnum.PLANNING, managerId: 'manager-1' },
        }),
      );
      expect(result.meta.total).toBe(1);
    });
  });

  describe('findOne', () => {
    it('throws when the project does not exist (or is archived)', async () => {
      prisma.project.findFirst.mockResolvedValue(null);

      await expect(service.findOne('missing-id')).rejects.toBeInstanceOf(ResourceNotFoundException);
    });
  });

  describe('create', () => {
    it('rejects creation when the order does not exist', async () => {
      prisma.order.findFirst.mockResolvedValue(null);

      await expect(service.create({ orderId: 'missing', clientId: 'client-1', name: 'X' } as any)).rejects.toBeInstanceOf(
        NotFoundException,
      );
      expect(prisma.project.create).not.toHaveBeenCalled();
    });

    it('rejects creation when a project already exists for the order', async () => {
      prisma.order.findFirst.mockResolvedValue({ id: 'order-1' });
      prisma.project.findUnique.mockResolvedValue({ id: 'existing-project' });

      await expect(
        service.create({ orderId: 'order-1', clientId: 'client-1', name: 'X' } as any),
      ).rejects.toBeInstanceOf(ConflictException);
      expect(prisma.project.create).not.toHaveBeenCalled();
    });

    it('rejects creation when the client does not exist', async () => {
      prisma.order.findFirst.mockResolvedValue({ id: 'order-1' });
      prisma.project.findUnique.mockResolvedValue(null);
      prisma.clientProfile.findFirst.mockResolvedValue(null);

      await expect(
        service.create({ orderId: 'order-1', clientId: 'missing-client', name: 'X' } as any),
      ).rejects.toBeInstanceOf(NotFoundException);
    });

    it('creates the project with a generated slug and logs a timeline entry', async () => {
      prisma.order.findFirst.mockResolvedValue({ id: 'order-1' });
      prisma.project.findUnique.mockResolvedValue(null);
      prisma.clientProfile.findFirst.mockResolvedValue({ id: 'client-1' });
      prisma.project.create.mockResolvedValue({ id: 'project-1', name: 'Website Revamp', status: ProjectStatusEnum.PLANNING });
      prisma.timeline.create.mockResolvedValue({});

      const result = await service.create({ orderId: 'order-1', clientId: 'client-1', name: 'Website Revamp' } as any);

      expect(prisma.project.create).toHaveBeenCalledWith(
        expect.objectContaining({ data: expect.objectContaining({ slug: expect.stringMatching(/^website-revamp-\d+$/) }) }),
      );
      expect(prisma.timeline.create).toHaveBeenCalledWith(
        expect.objectContaining({ data: expect.objectContaining({ eventType: 'PROJECT_CREATED' }) }),
      );
      expect(result.id).toBe('project-1');
    });
  });

  describe('update', () => {
    it('logs a status-change timeline entry only when the status actually changes', async () => {
      prisma.project.findFirst.mockResolvedValue({ id: 'project-1', status: ProjectStatusEnum.PLANNING, name: 'X', clientId: 'client-1' });
      prisma.project.update.mockResolvedValue({ id: 'project-1', status: ProjectStatusEnum.PLANNING });

      await service.update('project-1', { budget: 5000 } as any);

      expect(prisma.timeline.create).not.toHaveBeenCalled();
    });

    it('logs a timeline entry when the status changes', async () => {
      prisma.project.findFirst.mockResolvedValue({ id: 'project-1', status: ProjectStatusEnum.PLANNING, name: 'X', clientId: 'client-1' });
      prisma.project.update.mockResolvedValue({ id: 'project-1', status: ProjectStatusEnum.IN_PROGRESS });
      prisma.timeline.create.mockResolvedValue({});

      await service.update('project-1', { status: ProjectStatusEnum.IN_PROGRESS } as any);

      expect(prisma.timeline.create).toHaveBeenCalledWith(
        expect.objectContaining({ data: expect.objectContaining({ eventType: 'PROJECT_STATUS_CHANGED' }) }),
      );
    });
  });

  describe('recalculateProgress', () => {
    it('returns 0 when the project has no tasks', async () => {
      prisma.task.findMany.mockResolvedValue([]);

      const result = await service.recalculateProgress('project-1');

      expect(result).toBe(0);
      expect(prisma.project.update).not.toHaveBeenCalled();
    });

    it('computes the percentage of completed tasks and persists it', async () => {
      prisma.task.findMany.mockResolvedValue([
        { status: 'COMPLETED' },
        { status: 'COMPLETED' },
        { status: 'TODO' },
        { status: 'IN_PROGRESS' },
      ]);
      prisma.project.update.mockResolvedValue({});

      const result = await service.recalculateProgress('project-1');

      expect(result).toBe(50);
      expect(prisma.project.update).toHaveBeenCalledWith({ where: { id: 'project-1' }, data: { progress: 50 } });
    });
  });

  describe('softDelete', () => {
    it('marks the project as archived rather than removing it', async () => {
      prisma.project.findFirst.mockResolvedValue({ id: 'project-1' });
      prisma.project.update.mockResolvedValue({});

      const result = await service.softDelete('project-1', 'admin-1');

      expect(prisma.project.update).toHaveBeenCalledWith({
        where: { id: 'project-1' },
        data: { deletedAt: expect.any(Date), updatedBy: 'admin-1' },
      });
      expect(result.message).toContain('project-1');
    });
  });
});
