import { PrismaService } from '../prisma/prisma.service';
import { CreateLeadDto } from './dto/create-lead.dto';
import { UpdateLeadDto } from './dto/update-lead.dto';
export declare class LeadsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(createLeadDto: CreateLeadDto): Promise<{
        email: string;
        company: string | null;
        service: string | null;
        message: string;
        id: string;
        createdAt: Date;
        firstName: string;
        lastName: string;
        phone: string | null;
        status: import(".prisma/client").$Enums.LeadStatusEnum;
        updatedAt: Date;
        deletedAt: Date | null;
    }>;
    findAll(): Promise<{
        email: string;
        company: string | null;
        service: string | null;
        message: string;
        id: string;
        createdAt: Date;
        firstName: string;
        lastName: string;
        phone: string | null;
        status: import(".prisma/client").$Enums.LeadStatusEnum;
        updatedAt: Date;
        deletedAt: Date | null;
    }[]>;
    findOne(id: string): Promise<{
        email: string;
        company: string | null;
        service: string | null;
        message: string;
        id: string;
        createdAt: Date;
        firstName: string;
        lastName: string;
        phone: string | null;
        status: import(".prisma/client").$Enums.LeadStatusEnum;
        updatedAt: Date;
        deletedAt: Date | null;
    }>;
    update(id: string, updateLeadDto: UpdateLeadDto): Promise<{
        email: string;
        company: string | null;
        service: string | null;
        message: string;
        id: string;
        createdAt: Date;
        firstName: string;
        lastName: string;
        phone: string | null;
        status: import(".prisma/client").$Enums.LeadStatusEnum;
        updatedAt: Date;
        deletedAt: Date | null;
    }>;
    remove(id: string): Promise<{
        email: string;
        company: string | null;
        service: string | null;
        message: string;
        id: string;
        createdAt: Date;
        firstName: string;
        lastName: string;
        phone: string | null;
        status: import(".prisma/client").$Enums.LeadStatusEnum;
        updatedAt: Date;
        deletedAt: Date | null;
    }>;
}
