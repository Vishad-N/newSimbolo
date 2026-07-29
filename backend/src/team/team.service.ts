import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { BaseService } from '../shared/abstractions/base.service';
import { AssignTeamMemberDto } from './dto/assign-team-member.dto';

@Injectable()
export class TeamService extends BaseService {
  constructor(private readonly prisma: PrismaService) {
    super('TeamService');
  }

  async getProjectTeam(projectId: string) {
    const project = await this.prisma.project.findFirst({ where: { id: projectId, deletedAt: null } });
    if (!project) throw new NotFoundException(`Project with ID ${projectId} not found`);

    return this.prisma.projectTeamMember.findMany({
      where: { projectId },
      include: {
        user: { select: { id: true, firstName: true, lastName: true, email: true, avatarUrl: true } },
      },
      orderBy: { assignedAt: 'asc' },
    });
  }

  async assignMember(dto: AssignTeamMemberDto): Promise<any> {
    const project = await this.prisma.project.findFirst({ where: { id: dto.projectId, deletedAt: null } });
    if (!project) throw new NotFoundException(`Project with ID ${dto.projectId} not found`);

    const user = await this.prisma.user.findUnique({ where: { id: dto.userId } });
    if (!user) throw new NotFoundException(`User with ID ${dto.userId} not found`);

    const role = dto.role ?? 'MEMBER';
    const existing = await this.prisma.projectTeamMember.findUnique({
      where: { projectId_userId_role: { projectId: dto.projectId, userId: dto.userId, role } },
    });
    if (existing)
      throw new ConflictException(
        `User ${dto.userId} is already assigned to project ${dto.projectId} with role ${role}`,
      );

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

  async removeMember(projectTeamMemberId: string): Promise<{ message: string }> {
    const member = await this.prisma.projectTeamMember.findUnique({ where: { id: projectTeamMemberId } });
    if (!member) throw new NotFoundException(`Team member assignment ${projectTeamMemberId} not found`);

    await this.prisma.projectTeamMember.delete({ where: { id: projectTeamMemberId } });
    return { message: `Team member removed from project` };
  }
}
