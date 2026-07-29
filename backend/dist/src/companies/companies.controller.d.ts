import { CompaniesService } from './companies.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { JwtPayload } from '../auth/interfaces/jwt-payload.interface';
export declare class CompaniesController {
    private readonly companiesService;
    constructor(companiesService: CompaniesService);
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
            primaryContactId: string | null;
        })[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    findOne(id: string): Promise<{
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
        primaryContactId: string | null;
    }>;
    create(dto: CreateCompanyDto, user: JwtPayload): Promise<{
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
        primaryContactId: string | null;
    }>;
    update(id: string, dto: UpdateCompanyDto, user: JwtPayload): Promise<{
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
        primaryContactId: string | null;
    }>;
    remove(id: string, user: JwtPayload): Promise<{
        message: string;
    }>;
}
