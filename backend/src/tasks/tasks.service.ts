import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { BaseService } from '../shared/abstractions/base.service';
import { CreateTaskDto, UpdateTaskDto, AddTaskCommentDto } from './dto/task.dto';
import { Task, TaskStatusEnum } from '@prisma/client';

@Injectable()
export class TasksService extends BaseService {
  constructor(private readonly prisma: PrismaService) {
    super('TasksService');
  }

  private readonly taskInclude = {
    assignee: { select: { id: true, firstName: true, lastName: true, email: true, avatarUrl: true } },
    milestone: { select: { id: true, title: true, status: true } },
    comments: {
      include: { sender: { select: { id: true, firstName: true, lastName: true, avatarUrl: true } } },
      orderBy: { createdAt: 'asc' as const },
    },
    _count: { select: { comments: true, attachments: true } },
  };

  async findAll(projectId: string, status?: TaskStatusEnum, assignedToId?: string) {
    const project = await this.prisma.project.findFirst({ where: { id: projectId, deletedAt: null } });
    if (!project) throw new NotFoundException(`Project with ID ${projectId} not found`);

    const where: any = { projectId };
    if (status) where.status = status;
    if (assignedToId) where.assignedToId = assignedToId;

    return this.prisma.task.findMany({
      where,
      include: this.taskInclude,
      orderBy: [{ priority: 'desc' }, { createdAt: 'asc' }],
    });
  }

  async findOne(id: string): Promise<Task> {
    const task = await this.prisma.task.findUnique({
      where: { id },
      include: this.taskInclude,
    });
    return this.checkEntityExists(task, 'Task', id);
  }

  async create(dto: CreateTaskDto, createdBy?: string): Promise<Task> {
    const project = await this.prisma.project.findFirst({ where: { id: dto.projectId, deletedAt: null } });
    if (!project) throw new NotFoundException(`Project with ID ${dto.projectId} not found`);

    if (dto.milestoneId) {
      const m = await this.prisma.projectMilestone.findUnique({ where: { id: dto.milestoneId } });
      if (!m) throw new NotFoundException(`Milestone ${dto.milestoneId} not found`);
    }

    const task = await this.prisma.task.create({
      data: {
        projectId: dto.projectId,
        milestoneId: dto.milestoneId ?? null,
        title: dto.title,
        description: dto.description ?? null,
        assignedToId: dto.assignedToId ?? null,
        status: dto.status ?? TaskStatusEnum.TODO,
        priority: dto.priority ?? 'MEDIUM',
        estimatedHours: dto.estimatedHours ?? null,
        dueDate: dto.dueDate ? new Date(dto.dueDate) : null,
        createdBy: createdBy ?? null,
      },
      include: this.taskInclude,
    });

    if (dto.assignedToId) {
      await this.prisma.timeline.create({
        data: {
          title: `Task "${task.title}" assigned`,
          description: `Task created and assigned`,
          eventType: 'TASK_ASSIGNED',
          projectId: dto.projectId,
          clientId: project.clientId,
          userId: dto.assignedToId,
        },
      });
    }

    return task;
  }

  async update(id: string, dto: UpdateTaskDto, updatedBy?: string): Promise<Task> {
    const existing = await this.findOne(id);

    const updated = await this.prisma.task.update({
      where: { id },
      data: {
        ...(dto.title !== undefined && { title: dto.title }),
        ...(dto.description !== undefined && { description: dto.description }),
        ...(dto.assignedToId !== undefined && { assignedToId: dto.assignedToId }),
        ...(dto.status !== undefined && { status: dto.status }),
        ...(dto.priority !== undefined && { priority: dto.priority }),
        ...(dto.estimatedHours !== undefined && { estimatedHours: dto.estimatedHours }),
        ...(dto.actualHours !== undefined && { actualHours: dto.actualHours }),
        ...(dto.progress !== undefined && { progress: dto.progress }),
        ...(dto.dueDate !== undefined && { dueDate: new Date(dto.dueDate) }),
        ...(dto.milestoneId !== undefined && { milestoneId: dto.milestoneId }),
        updatedBy: updatedBy ?? null,
      },
      include: this.taskInclude,
    });

    return updated;
  }

  async addComment(taskId: string, dto: AddTaskCommentDto, senderId: string): Promise<any> {
    await this.findOne(taskId);
    return this.prisma.taskComment.create({
      data: { taskId, senderId, message: dto.message },
      include: { sender: { select: { id: true, firstName: true, lastName: true, avatarUrl: true } } },
    });
  }

  async remove(id: string): Promise<{ message: string }> {
    await this.findOne(id);
    await this.prisma.task.delete({ where: { id } });
    return { message: `Task ${id} removed` };
  }
}
