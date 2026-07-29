import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { BaseService } from '../shared/abstractions/base.service';
import { CreateMilestoneDto, UpdateMilestoneDto } from './dto/milestone.dto';
import { ProjectMilestone, MilestoneStatusEnum } from '@prisma/client';

@Injectable()
export class MilestonesService extends BaseService {
  constructor(private readonly prisma: PrismaService) {
    super('MilestonesService');
  }

  async findAll(projectId: string) {
    const project = await this.prisma.project.findFirst({ where: { id: projectId, deletedAt: null } });
    if (!project) throw new NotFoundException(`Project with ID ${projectId} not found`);

    return this.prisma.projectMilestone.findMany({
      where: { projectId },
      include: {
        tasks: { select: { id: true, title: true, status: true } },
        dependsOn: { select: { id: true, title: true, status: true } },
      },
      orderBy: { sortOrder: 'asc' },
    });
  }

  async findOne(id: string): Promise<ProjectMilestone> {
    const milestone = await this.prisma.projectMilestone.findUnique({
      where: { id },
      include: {
        project: { select: { id: true, name: true, clientId: true } },
        tasks: {
          include: { assignee: { select: { id: true, firstName: true, lastName: true } } },
        },
        dependsOn: { select: { id: true, title: true, status: true } },
        dependentMilestones: { select: { id: true, title: true, status: true } },
      },
    });
    return this.checkEntityExists(milestone, 'ProjectMilestone', id);
  }

  async create(dto: CreateMilestoneDto): Promise<ProjectMilestone> {
    const project = await this.prisma.project.findFirst({ where: { id: dto.projectId, deletedAt: null } });
    if (!project) throw new NotFoundException(`Project with ID ${dto.projectId} not found`);

    if (dto.dependsOnId) {
      const dep = await this.prisma.projectMilestone.findUnique({ where: { id: dto.dependsOnId } });
      if (!dep) throw new NotFoundException(`Dependency milestone ${dto.dependsOnId} not found`);
    }

    const milestone = await this.prisma.projectMilestone.create({
      data: {
        projectId: dto.projectId,
        title: dto.title,
        description: dto.description ?? null,
        dueDate: dto.dueDate ? new Date(dto.dueDate) : null,
        dependsOnId: dto.dependsOnId ?? null,
        sortOrder: dto.sortOrder ?? 0,
      },
      include: { tasks: { select: { id: true, title: true, status: true } } },
    });

    await this.prisma.timeline.create({
      data: {
        title: `Milestone "${milestone.title}" added`,
        description: `New milestone created for project`,
        eventType: 'MILESTONE_CREATED',
        projectId: dto.projectId,
        clientId: project.clientId,
      },
    });

    return milestone;
  }

  async update(id: string, dto: UpdateMilestoneDto): Promise<ProjectMilestone> {
    const existing = await this.findOne(id);

    const updated = await this.prisma.projectMilestone.update({
      where: { id },
      data: {
        ...(dto.title !== undefined && { title: dto.title }),
        ...(dto.description !== undefined && { description: dto.description }),
        ...(dto.dueDate !== undefined && { dueDate: new Date(dto.dueDate) }),
        ...(dto.completedDate !== undefined && { completedDate: new Date(dto.completedDate) }),
        ...(dto.status !== undefined && { status: dto.status }),
        ...(dto.sortOrder !== undefined && { sortOrder: dto.sortOrder }),
        ...(dto.dependsOnId !== undefined && { dependsOnId: dto.dependsOnId }),
      },
      include: { tasks: { select: { id: true, title: true, status: true } } },
    });

    // Log milestone completion
    if (dto.status === MilestoneStatusEnum.COMPLETED && (existing as any).status !== MilestoneStatusEnum.COMPLETED) {
      await this.prisma.timeline.create({
        data: {
          title: `Milestone "${(existing as any).title}" completed`,
          description: `Milestone reached COMPLETED status`,
          eventType: 'MILESTONE_COMPLETED',
          projectId: (existing as any).projectId,
        },
      });
    }

    return updated;
  }

  async remove(id: string): Promise<{ message: string }> {
    await this.findOne(id);
    await this.prisma.projectMilestone.delete({ where: { id } });
    return { message: `Milestone ${id} removed` };
  }
}
