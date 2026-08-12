import { PrismaService } from '../prisma/prisma.service';
import { BaseService } from '../shared/abstractions/base.service';
import { AssignTeamMemberDto } from './dto/assign-team-member.dto';
export declare class TeamService extends BaseService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    getProjectTeam(projectId: string): Promise<({
        user: {
            email: string;
            id: string;
            firstName: string;
            lastName: string;
            avatarUrl: string | null;
        };
    } & {
        role: string;
        id: string;
        userId: string;
        projectId: string;
        responsibilities: string | null;
        assignedAt: Date;
    })[]>;
    assignMember(dto: AssignTeamMemberDto): Promise<any>;
    removeMember(projectTeamMemberId: string): Promise<{
        message: string;
    }>;
}
