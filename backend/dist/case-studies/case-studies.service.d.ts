import { BaseService } from '../shared/abstractions/base.service';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCaseStudyDto } from './dto/create-case-study.dto';
import { UpdateCaseStudyDto } from './dto/update-case-study.dto';
import { CreateCaseStudyCategoryDto } from './dto/create-case-study-category.dto';
import { CreateCaseStudyMetricDto } from './dto/create-case-study-metric.dto';
import { CreateBeforeAfterDto } from './dto/create-before-after.dto';
import { CaseStudy, CaseStudyCategory, CaseStudyMetric, BeforeAfterComparison, CaseStudyStatusEnum } from '@prisma/client';
export declare class CaseStudiesService extends BaseService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    private generateSlug;
    getCaseStudies(categoryId?: string, serviceId?: string, search?: string, status?: CaseStudyStatusEnum): Promise<CaseStudy[]>;
    getCaseStudyBySlug(slug: string): Promise<CaseStudy>;
    createCaseStudy(dto: CreateCaseStudyDto, createdBy?: string): Promise<CaseStudy>;
    updateCaseStudy(id: string, dto: UpdateCaseStudyDto, updatedBy?: string): Promise<CaseStudy>;
    deleteCaseStudy(id: string, deletedBy?: string): Promise<{
        success: boolean;
    }>;
    getCategories(): Promise<CaseStudyCategory[]>;
    createCategory(dto: CreateCaseStudyCategoryDto): Promise<CaseStudyCategory>;
    deleteCategory(id: string): Promise<{
        success: boolean;
    }>;
    addMetric(dto: CreateCaseStudyMetricDto): Promise<CaseStudyMetric>;
    deleteMetric(id: string): Promise<{
        success: boolean;
    }>;
    addBeforeAfter(dto: CreateBeforeAfterDto): Promise<BeforeAfterComparison>;
    deleteBeforeAfter(id: string): Promise<{
        success: boolean;
    }>;
}
