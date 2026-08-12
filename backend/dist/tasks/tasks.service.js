"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TasksService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const base_service_1 = require("../shared/abstractions/base.service");
const client_1 = require("@prisma/client");
let TasksService = class TasksService extends base_service_1.BaseService {
    prisma;
    constructor(prisma) {
        super('TasksService');
        this.prisma = prisma;
    }
    taskInclude = {
        assignee: { select: { id: true, firstName: true, lastName: true, email: true, avatarUrl: true } },
        milestone: { select: { id: true, title: true, status: true } },
        comments: {
            include: { sender: { select: { id: true, firstName: true, lastName: true, avatarUrl: true } } },
            orderBy: { createdAt: 'asc' },
        },
        _count: { select: { comments: true, attachments: true } },
    };
    async findAll(projectId, status, assignedToId) {
        const project = await this.prisma.project.findFirst({ where: { id: projectId, deletedAt: null } });
        if (!project)
            throw new common_1.NotFoundException(`Project with ID ${projectId} not found`);
        const where = { projectId };
        if (status)
            where.status = status;
        if (assignedToId)
            where.assignedToId = assignedToId;
        return this.prisma.task.findMany({
            where,
            include: this.taskInclude,
            orderBy: [{ priority: 'desc' }, { createdAt: 'asc' }],
        });
    }
    async findOne(id) {
        const task = await this.prisma.task.findUnique({
            where: { id },
            include: this.taskInclude,
        });
        return this.checkEntityExists(task, 'Task', id);
    }
    async create(dto, createdBy) {
        const project = await this.prisma.project.findFirst({ where: { id: dto.projectId, deletedAt: null } });
        if (!project)
            throw new common_1.NotFoundException(`Project with ID ${dto.projectId} not found`);
        if (dto.milestoneId) {
            const m = await this.prisma.projectMilestone.findUnique({ where: { id: dto.milestoneId } });
            if (!m)
                throw new common_1.NotFoundException(`Milestone ${dto.milestoneId} not found`);
        }
        const task = await this.prisma.task.create({
            data: {
                projectId: dto.projectId,
                milestoneId: dto.milestoneId ?? null,
                title: dto.title,
                description: dto.description ?? null,
                assignedToId: dto.assignedToId ?? null,
                status: dto.status ?? client_1.TaskStatusEnum.TODO,
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
    async update(id, dto, updatedBy) {
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
    async addComment(taskId, dto, senderId) {
        await this.findOne(taskId);
        return this.prisma.taskComment.create({
            data: { taskId, senderId, message: dto.message },
            include: { sender: { select: { id: true, firstName: true, lastName: true, avatarUrl: true } } },
        });
    }
    async remove(id) {
        await this.findOne(id);
        await this.prisma.task.delete({ where: { id } });
        return { message: `Task ${id} removed` };
    }
};
exports.TasksService = TasksService;
exports.TasksService = TasksService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], TasksService);
//# sourceMappingURL=tasks.service.js.map