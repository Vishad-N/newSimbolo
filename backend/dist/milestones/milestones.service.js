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
exports.MilestonesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const base_service_1 = require("../shared/abstractions/base.service");
const client_1 = require("@prisma/client");
let MilestonesService = class MilestonesService extends base_service_1.BaseService {
    prisma;
    constructor(prisma) {
        super('MilestonesService');
        this.prisma = prisma;
    }
    async findAll(projectId) {
        const project = await this.prisma.project.findFirst({ where: { id: projectId, deletedAt: null } });
        if (!project)
            throw new common_1.NotFoundException(`Project with ID ${projectId} not found`);
        return this.prisma.projectMilestone.findMany({
            where: { projectId },
            include: {
                tasks: { select: { id: true, title: true, status: true } },
                dependsOn: { select: { id: true, title: true, status: true } },
            },
            orderBy: { sortOrder: 'asc' },
        });
    }
    async findOne(id) {
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
    async create(dto) {
        const project = await this.prisma.project.findFirst({ where: { id: dto.projectId, deletedAt: null } });
        if (!project)
            throw new common_1.NotFoundException(`Project with ID ${dto.projectId} not found`);
        if (dto.dependsOnId) {
            const dep = await this.prisma.projectMilestone.findUnique({ where: { id: dto.dependsOnId } });
            if (!dep)
                throw new common_1.NotFoundException(`Dependency milestone ${dto.dependsOnId} not found`);
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
    async update(id, dto) {
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
        if (dto.status === client_1.MilestoneStatusEnum.COMPLETED && existing.status !== client_1.MilestoneStatusEnum.COMPLETED) {
            await this.prisma.timeline.create({
                data: {
                    title: `Milestone "${existing.title}" completed`,
                    description: `Milestone reached COMPLETED status`,
                    eventType: 'MILESTONE_COMPLETED',
                    projectId: existing.projectId,
                },
            });
        }
        return updated;
    }
    async remove(id) {
        await this.findOne(id);
        await this.prisma.projectMilestone.delete({ where: { id } });
        return { message: `Milestone ${id} removed` };
    }
};
exports.MilestonesService = MilestonesService;
exports.MilestonesService = MilestonesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], MilestonesService);
//# sourceMappingURL=milestones.service.js.map