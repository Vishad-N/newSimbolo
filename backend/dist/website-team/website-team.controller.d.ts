import { WebsiteTeamService } from './website-team.service';
import { CreateWebsiteTeamMemberDto } from './dto/create-website-team-member.dto';
import { UpdateWebsiteTeamMemberDto } from './dto/update-website-team-member.dto';
export declare class WebsiteTeamController {
    private readonly websiteTeamService;
    constructor(websiteTeamService: WebsiteTeamService);
    create(createDto: CreateWebsiteTeamMemberDto): Promise<{
        id: string;
        createdAt: Date;
        name: string;
        updatedAt: Date;
        isActive: boolean;
        image: string | null;
        bio: string | null;
        designation: string;
        displayOrder: number;
        socialLinks: import("@prisma/client/runtime/library").JsonValue | null;
    }>;
    findAll(activeOnly?: string): Promise<{
        id: string;
        createdAt: Date;
        name: string;
        updatedAt: Date;
        isActive: boolean;
        image: string | null;
        bio: string | null;
        designation: string;
        displayOrder: number;
        socialLinks: import("@prisma/client/runtime/library").JsonValue | null;
    }[]>;
    findOne(id: string): Promise<{
        id: string;
        createdAt: Date;
        name: string;
        updatedAt: Date;
        isActive: boolean;
        image: string | null;
        bio: string | null;
        designation: string;
        displayOrder: number;
        socialLinks: import("@prisma/client/runtime/library").JsonValue | null;
    }>;
    reorder(updates: {
        id: string;
        displayOrder: number;
    }[]): Promise<{
        id: string;
        createdAt: Date;
        name: string;
        updatedAt: Date;
        isActive: boolean;
        image: string | null;
        bio: string | null;
        designation: string;
        displayOrder: number;
        socialLinks: import("@prisma/client/runtime/library").JsonValue | null;
    }[]>;
    update(id: string, updateDto: UpdateWebsiteTeamMemberDto): Promise<{
        id: string;
        createdAt: Date;
        name: string;
        updatedAt: Date;
        isActive: boolean;
        image: string | null;
        bio: string | null;
        designation: string;
        displayOrder: number;
        socialLinks: import("@prisma/client/runtime/library").JsonValue | null;
    }>;
    remove(id: string): Promise<{
        id: string;
        createdAt: Date;
        name: string;
        updatedAt: Date;
        isActive: boolean;
        image: string | null;
        bio: string | null;
        designation: string;
        displayOrder: number;
        socialLinks: import("@prisma/client/runtime/library").JsonValue | null;
    }>;
}
