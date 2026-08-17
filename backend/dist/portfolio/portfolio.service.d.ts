import { BaseService } from '../shared/abstractions/base.service';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePortfolioProjectDto } from './dto/create-portfolio-project.dto';
import { UpdatePortfolioProjectDto } from './dto/update-portfolio-project.dto';
import { CreatePortfolioCategoryDto } from './dto/create-portfolio-category.dto';
import { PortfolioProject, PortfolioCategory, PortfolioStatusEnum } from '@prisma/client';
export declare class PortfolioService extends BaseService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    private generateSlug;
    getProjects(categoryId?: string, serviceId?: string, isFeatured?: boolean, search?: string, status?: PortfolioStatusEnum): Promise<PortfolioProject[]>;
    getProjectBySlug(slug: string): Promise<PortfolioProject>;
    createProject(dto: CreatePortfolioProjectDto, createdBy?: string): Promise<PortfolioProject>;
    updateProject(id: string, dto: UpdatePortfolioProjectDto, updatedBy?: string): Promise<PortfolioProject>;
    deleteProject(id: string, deletedBy?: string): Promise<{
        success: boolean;
    }>;
    getCategories(): Promise<PortfolioCategory[]>;
    createCategory(dto: CreatePortfolioCategoryDto): Promise<PortfolioCategory>;
    deleteCategory(id: string): Promise<{
        success: boolean;
    }>;
}
