import { TeamService } from './team.service';
import { AssignTeamMemberDto } from './dto/assign-team-member.dto';
export declare class TeamController {
    private readonly teamService;
    constructor(teamService: TeamService);
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
    assign(dto: AssignTeamMemberDto): Promise<any>;
    remove(id: string): Promise<{
        message: string;
    }>;
}
