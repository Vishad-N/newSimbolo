import { PrismaService } from '../prisma/prisma.service';
import { BaseService } from '../shared/abstractions/base.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { Company } from '@prisma/client';
export declare class CompaniesService extends BaseService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    private generateSlug;
    private readonly companyInclude;
    findAll(search?: string, industry?: string, page?: number, limit?: number): Promise<{
        data: ({
            _count: {
                clients: number;
            };
        } & {
            id: string;
            createdAt: Date;
            name: string;
            updatedAt: Date;
            deletedAt: Date | null;
            createdBy: string | null;
            updatedBy: string | null;
            slug: string;
            gstNumber: string | null;
            billingAddress: string | null;
            website: string | null;
            industry: string | null;
            size: string | null;
            logoUrl: string | null;
            logoMediaId: string | null;
            primaryContactId: string | null;
        })[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    findOne(id: string): Promise<Company>;
    findBySlug(slug: string): Promise<Company>;
    create(dto: CreateCompanyDto, createdBy?: string): Promise<Company>;
    update(id: string, dto: UpdateCompanyDto, updatedBy?: string): Promise<Company>;
    softDelete(id: string, deletedBy?: string): Promise<{
        message: string;
    }>;
}
