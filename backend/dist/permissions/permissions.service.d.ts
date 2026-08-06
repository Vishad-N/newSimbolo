import { PrismaService } from '../prisma/prisma.service';
import { BaseService } from '../shared/abstractions/base.service';
export declare class PermissionsService extends BaseService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    findAll(): Promise<{
        id: string;
        createdAt: Date;
        name: string;
        updatedAt: Date;
        createdBy: string | null;
        updatedBy: string | null;
        description: string | null;
        slug: string;
        module: string;
    }[]>;
    findByModule(module: string): Promise<{
        id: string;
        createdAt: Date;
        name: string;
        updatedAt: Date;
        createdBy: string | null;
        updatedBy: string | null;
        description: string | null;
        slug: string;
        module: string;
    }[]>;
    findOne(id: string): Promise<{
        id: string;
        createdAt: Date;
        name: string;
        updatedAt: Date;
        createdBy: string | null;
        updatedBy: string | null;
        description: string | null;
        slug: string;
        module: string;
    }>;
}
