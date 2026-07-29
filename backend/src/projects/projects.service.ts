import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { BaseService } from '../shared/abstractions/base.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { Project, ProjectStatusEnum } from '@prisma/client';

@Injectable()
export class ProjectsService extends BaseService {
  constructor(private readonly prisma: PrismaService) {
    super('ProjectsService');
  }

  private generateSlug(name: string): string {
    return `${name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')}-${Date.now()}`;
  }

  private readonly projectInclude = {
    order: { select: { id: true, orderNumber: true, status: true } },
    client: {
      include: {
        user: { select: { id: true, firstName: true, lastName: true, email: true } },
        company: { select: { id: true, name: true } },
      },
    },
    manager: { select: { id: true, firstName: true, lastName: true, email: true } },
    teamMembers: {
      include: { user: { select: { id: true, firstName: true, lastName: true, avatarUrl: true } } },
    },
    _count: {
      select: { milestones: true, tasks: true, deliverables: true },
    },
  };

  async findAll(clientId?: string, status?: ProjectStatusEnum, managerId?: string, page = 1, limit = 20) {
    const where: any = { deletedAt: null };
    if (clientId) where.clientId = clientId;
    if (status) where.status = status;
    if (managerId) where.managerId = managerId;

    const [data, total] = await Promise.all([
      this.prisma.project.findMany({
        where,
        include: this.projectInclude,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.project.count({ where }),
    ]);

    return { data, meta: { total, page, limit, totalPages: Math.ceil(total / limit) } };
  }

  async findOne(id: string): Promise<Project> {
    const project = await this.prisma.project.findFirst({
      where: { id, deletedAt: null },
      include: {
        ...this.projectInclude,
        milestones: { orderBy: { sortOrder: 'asc' } },
        tasks: {
          orderBy: { createdAt: 'desc' },
          take: 10,
          include: { assignee: { select: { id: true, firstName: true, lastName: true, avatarUrl: true } } },
        },
        deliverables: { orderBy: { createdAt: 'desc' }, where: { deletedAt: null } },
        timelines: { orderBy: { date: 'desc' }, take: 30 },
        documents: { where: { deletedAt: null }, orderBy: { createdAt: 'desc' } },
      },
    });
    return this.checkEntityExists(project, 'Project', id);
  }

  async create(dto: CreateProjectDto, createdBy?: string): Promise<Project> {
    // Validate order and client
    const order = await this.prisma.order.findFirst({ where: { id: dto.orderId, deletedAt: null } });
    if (!order) throw new NotFoundException(`Order with ID ${dto.orderId} not found`);

    const existingProject = await this.prisma.project.findUnique({ where: { orderId: dto.orderId } });
    if (existingProject) throw new ConflictException(`A project already exists for order ${dto.orderId}`);

    const client = await this.prisma.clientProfile.findFirst({ where: { id: dto.clientId, deletedAt: null } });
    if (!client) throw new NotFoundException(`Client with ID ${dto.clientId} not found`);

    const slug = this.generateSlug(dto.name);

    const project = await this.prisma.project.create({
      data: {
        name: dto.name,
        slug,
        description: dto.description ?? null,
        orderId: dto.orderId,
        clientId: dto.clientId,
        managerId: dto.managerId ?? null,
        status: dto.status ?? ProjectStatusEnum.PLANNING,
        priority: dto.priority ?? 'MEDIUM',
        budget: dto.budget ?? null,
        startDate: dto.startDate ? new Date(dto.startDate) : null,
        targetEndDate: dto.targetEndDate ? new Date(dto.targetEndDate) : null,
        createdBy: createdBy ?? null,
      },
      include: this.projectInclude,
    });

    // Log activity
    await this.prisma.timeline.create({
      data: {
        title: `Project "${project.name}" created`,
        description: `New project created with status ${project.status}`,
        eventType: 'PROJECT_CREATED',
        projectId: project.id,
        clientId: dto.clientId,
        userId: createdBy ?? null,
      },
    });

    return project;
  }

  async update(id: string, dto: UpdateProjectDto, updatedBy?: string): Promise<Project> {
    const existing = await this.findOne(id);

    const updated = await this.prisma.project.update({
      where: { id },
      data: {
        ...(dto.name !== undefined && { name: dto.name }),
        ...(dto.description !== undefined && { description: dto.description }),
        ...(dto.managerId !== undefined && { managerId: dto.managerId }),
        ...(dto.status !== undefined && { status: dto.status }),
        ...(dto.priority !== undefined && { priority: dto.priority }),
        ...(dto.budget !== undefined && { budget: dto.budget }),
        ...(dto.progress !== undefined && { progress: dto.progress }),
        ...(dto.startDate !== undefined && { startDate: new Date(dto.startDate) }),
        ...(dto.targetEndDate !== undefined && { targetEndDate: new Date(dto.targetEndDate) }),
        ...(dto.actualEndDate !== undefined && { actualEndDate: new Date(dto.actualEndDate) }),
        updatedBy: updatedBy ?? null,
      },
      include: this.projectInclude,
    });

    // Log status change activity
    if (dto.status && dto.status !== (existing as any).status) {
      await this.prisma.timeline.create({
        data: {
          title: `Project status changed to ${dto.status}`,
          description: `Project "${(existing as any).name}" status changed from ${(existing as any).status} to ${dto.status}`,
          eventType: 'PROJECT_STATUS_CHANGED',
          projectId: id,
          clientId: (existing as any).clientId,
          userId: updatedBy ?? null,
        },
      });
    }

    return updated;
  }

  async recalculateProgress(id: string): Promise<number> {
    const tasks = await this.prisma.task.findMany({
      where: { projectId: id },
      select: { status: true },
    });

    if (tasks.length === 0) return 0;

    const completed = tasks.filter((t) => t.status === 'COMPLETED').length;
    const progress = Math.round((completed / tasks.length) * 100);

    await this.prisma.project.update({ where: { id }, data: { progress } });
    return progress;
  }

  async softDelete(id: string, deletedBy?: string): Promise<{ message: string }> {
    await this.findOne(id);
    await this.prisma.project.update({ where: { id }, data: { deletedAt: new Date(), updatedBy: deletedBy ?? null } });
    return { message: `Project ${id} has been archived` };
  }
}
