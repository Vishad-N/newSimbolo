import { PrismaService } from '../prisma/prisma.service';
import { CreateWebsiteTeamMemberDto } from './dto/create-website-team-member.dto';
import { UpdateWebsiteTeamMemberDto } from './dto/update-website-team-member.dto';
import { Prisma } from '@prisma/client';
export declare class WebsiteTeamService {
    private readonly prisma;
    constructor(prisma: PrismaService);
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
        socialLinks: Prisma.JsonValue | null;
    }>;
    findAll(activeOnly?: boolean): Promise<{
        id: string;
        createdAt: Date;
        name: string;
        updatedAt: Date;
        isActive: boolean;
        image: string | null;
        bio: string | null;
        designation: string;
        displayOrder: number;
        socialLinks: Prisma.JsonValue | null;
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
        socialLinks: Prisma.JsonValue | null;
    }>;
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
        socialLinks: Prisma.JsonValue | null;
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
        socialLinks: Prisma.JsonValue | null;
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
        socialLinks: Prisma.JsonValue | null;
    }[]>;
}
