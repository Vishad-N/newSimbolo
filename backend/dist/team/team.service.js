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
exports.TeamService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const base_service_1 = require("../shared/abstractions/base.service");
let TeamService = class TeamService extends base_service_1.BaseService {
    prisma;
    constructor(prisma) {
        super('TeamService');
        this.prisma = prisma;
    }
    async getProjectTeam(projectId) {
        const project = await this.prisma.project.findFirst({ where: { id: projectId, deletedAt: null } });
        if (!project)
            throw new common_1.NotFoundException(`Project with ID ${projectId} not found`);
        return this.prisma.projectTeamMember.findMany({
            where: { projectId },
            include: {
                user: { select: { id: true, firstName: true, lastName: true, email: true, avatarUrl: true } },
            },
            orderBy: { assignedAt: 'asc' },
        });
    }
    async assignMember(dto) {
        const project = await this.prisma.project.findFirst({ where: { id: dto.projectId, deletedAt: null } });
        if (!project)
            throw new common_1.NotFoundException(`Project with ID ${dto.projectId} not found`);
        const user = await this.prisma.user.findUnique({ where: { id: dto.userId } });
        if (!user)
            throw new common_1.NotFoundException(`User with ID ${dto.userId} not found`);
        const role = dto.role ?? 'MEMBER';
        const existing = await this.prisma.projectTeamMember.findUnique({
            where: { projectId_userId_role: { projectId: dto.projectId, userId: dto.userId, role } },
        });
        if (existing)
            throw new common_1.ConflictException(`User ${dto.userId} is already assigned to project ${dto.projectId} with role ${role}`);
        const member = await this.prisma.projectTeamMember.create({
            data: {
                projectId: dto.projectId,
                userId: dto.userId,
                role,
                responsibilities: dto.responsibilities ?? null,
            },
            include: {
                user: { select: { id: true, firstName: true, lastName: true, email: true, avatarUrl: true } },
            },
        });
        await this.prisma.timeline.create({
            data: {
                title: `${user.firstName} ${user.lastName} assigned to project`,
                description: `Assigned as ${role}${dto.responsibilities ? ': ' + dto.responsibilities : ''}`,
                eventType: 'TEAM_MEMBER_ASSIGNED',
                projectId: dto.projectId,
                clientId: project.clientId,
                userId: dto.userId,
            },
        });
        return member;
    }
    async removeMember(projectTeamMemberId) {
        const member = await this.prisma.projectTeamMember.findUnique({ where: { id: projectTeamMemberId } });
        if (!member)
            throw new common_1.NotFoundException(`Team member assignment ${projectTeamMemberId} not found`);
        await this.prisma.projectTeamMember.delete({ where: { id: projectTeamMemberId } });
        return { message: `Team member removed from project` };
    }
};
exports.TeamService = TeamService;
exports.TeamService = TeamService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], TeamService);
//# sourceMappingURL=team.service.js.map