"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CaseStudiesService = void 0;
const common_1 = require("@nestjs/common");
const base_service_1 = require("../shared/abstractions/base.service");
const prisma_service_1 = require("../prisma/prisma.service");
const client_1 = require("@prisma/client");
const custom_exceptions_1 = require("../common/exceptions/custom.exceptions");
let CaseStudiesService = class CaseStudiesService extends base_service_1.BaseService {
    prisma;
    constructor(prisma) {
        super('CaseStudiesService');
        this.prisma = prisma;
    }
    generateSlug(text) {
        return text
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '');
    }
    async getCaseStudies(categoryId, serviceId, search, status) {
        const where = { deletedAt: null };
        if (status) {
            where.status = status;
        }
        else {
            where.status = client_1.CaseStudyStatusEnum.PUBLISHED;
        }
        if (categoryId) {
            where.categoryId = categoryId;
        }
        if (serviceId) {
            where.serviceId = serviceId;
        }
        if (search) {
            where.OR = [
                { title: { contains: search, mode: 'insensitive' } },
                { clientName: { contains: search, mode: 'insensitive' } },
                { summary: { contains: search, mode: 'insensitive' } },
            ];
        }
        return this.prisma.caseStudy.findMany({
            where,
            include: {
                category: true,
                service: { select: { id: true, name: true, slug: true } },
                coverImage: true,
                metrics: { orderBy: { sortOrder: 'asc' } },
            },
            orderBy: { publishDate: 'desc' },
        });
    }
    async getCaseStudyBySlug(slug) {
        const study = await this.prisma.caseStudy.findUnique({
            where: { slug },
            include: {
                category: true,
                service: true,
                coverImage: true,
                metrics: { orderBy: { sortOrder: 'asc' } },
                beforeAfters: {
                    include: { beforeMedia: true, afterMedia: true },
                    orderBy: { sortOrder: 'asc' },
                },
                testimonials: true,
            },
        });
        if (study) {
            study.beforeAfters = study.beforeAfters.map((ba) => ({
                ...ba,
                beforeImage: ba.beforeMedia,
                afterImage: ba.afterMedia,
            }));
        }
        return this.checkEntityExists(study, 'CaseStudy', slug);
    }
    async createCaseStudy(dto, createdBy) {
        const slug = this.generateSlug(dto.title);
        const existing = await this.prisma.caseStudy.findUnique({ where: { slug } });
        if (existing) {
            throw new custom_exceptions_1.CustomConflictException(`Case study "${dto.title}" or slug "${slug}" already exists`);
        }
        if (dto.serviceId) {
            const s = await this.prisma.service.findUnique({ where: { id: dto.serviceId } });
            this.checkEntityExists(s, 'Service', dto.serviceId);
        }
        if (dto.categoryId) {
            const c = await this.prisma.caseStudyCategory.findUnique({ where: { id: dto.categoryId } });
            this.checkEntityExists(c, 'CaseStudyCategory', dto.categoryId);
        }
        const status = dto.status || client_1.CaseStudyStatusEnum.DRAFT;
        const publishDate = status === client_1.CaseStudyStatusEnum.PUBLISHED ? new Date() : null;
        const created = await this.prisma.caseStudy.create({
            data: {
                title: dto.title,
                slug,
                summary: dto.summary,
                challenge: dto.challenge,
                solution: dto.solution,
                results: dto.results,
                clientName: dto.clientName,
                industry: dto.industry || null,
                status,
                publishDate,
                serviceId: dto.serviceId || null,
                categoryId: dto.categoryId || null,
                coverImageId: dto.coverImageId || null,
                createdBy: createdBy || null,
            },
            include: { category: true, service: true, coverImage: true },
        });
        this.logger.log(`Created case study "${created.title}" (ID: ${created.id})`);
        return created;
    }
    async updateCaseStudy(id, dto, updatedBy) {
        const study = this.checkEntityExists(await this.prisma.caseStudy.findUnique({ where: { id } }), 'CaseStudy', id);
        let slug = study.slug;
        if (dto.title && dto.title !== study.title) {
            slug = this.generateSlug(dto.title);
            const conflict = await this.prisma.caseStudy.findFirst({ where: { slug, id: { not: id } } });
            if (conflict) {
                throw new custom_exceptions_1.CustomConflictException(`Case study title "${dto.title}" already exists`);
            }
        }
        let publishDate = study.publishDate;
        if (dto.status === client_1.CaseStudyStatusEnum.PUBLISHED && study.status !== client_1.CaseStudyStatusEnum.PUBLISHED) {
            publishDate = new Date();
        }
        return this.prisma.caseStudy.update({
            where: { id },
            data: {
                ...(dto.title !== undefined && { title: dto.title, slug }),
                ...(dto.summary !== undefined && { summary: dto.summary }),
                ...(dto.challenge !== undefined && { challenge: dto.challenge }),
                ...(dto.solution !== undefined && { solution: dto.solution }),
                ...(dto.results !== undefined && { results: dto.results }),
                ...(dto.clientName !== undefined && { clientName: dto.clientName }),
                ...(dto.industry !== undefined && { industry: dto.industry }),
                ...(dto.status !== undefined && { status: dto.status, publishDate }),
                ...(dto.serviceId !== undefined && { serviceId: dto.serviceId }),
                ...(dto.categoryId !== undefined && { categoryId: dto.categoryId }),
                ...(dto.coverImageId !== undefined && { coverImageId: dto.coverImageId }),
                updatedBy: updatedBy || null,
            },
            include: { category: true, service: true, coverImage: true, metrics: true },
        });
    }
    async deleteCaseStudy(id, deletedBy) {
        const study = await this.prisma.caseStudy.findUnique({ where: { id } });
        this.checkEntityExists(study, 'CaseStudy', id);
        await this.prisma.caseStudy.update({
            where: { id },
            data: { deletedAt: new Date(), updatedBy: deletedBy || null },
        });
        this.logger.log(`Soft-deleted case study ID: ${id}`);
        return { success: true };
    }
    // Categories
    async getCategories() {
        return this.prisma.caseStudyCategory.findMany({
            where: { deletedAt: null },
            include: { _count: { select: { caseStudies: true } } },
            orderBy: { name: 'asc' },
        });
    }
    async createCategory(dto) {
        const slug = this.generateSlug(dto.name);
        const existing = await this.prisma.caseStudyCategory.findUnique({ where: { slug } });
        if (existing) {
            throw new custom_exceptions_1.CustomConflictException(`Category "${dto.name}" already exists`);
        }
        return this.prisma.caseStudyCategory.create({
            data: { name: dto.name, slug, description: dto.description || null },
        });
    }
    async deleteCategory(id) {
        const c = await this.prisma.caseStudyCategory.findUnique({ where: { id } });
        this.checkEntityExists(c, 'CaseStudyCategory', id);
        await this.prisma.caseStudyCategory.update({
            where: { id },
            data: { deletedAt: new Date() },
        });
        return { success: true };
    }
    // Metrics
    async addMetric(dto) {
        const study = await this.prisma.caseStudy.findUnique({ where: { id: dto.caseStudyId } });
        this.checkEntityExists(study, 'CaseStudy', dto.caseStudyId);
        return this.prisma.caseStudyMetric.create({
            data: {
                label: dto.label,
                value: dto.value,
                changePercentage: dto.changePercentage || null,
                caseStudyId: dto.caseStudyId,
                sortOrder: dto.sortOrder !== undefined ? dto.sortOrder : 0,
            },
        });
    }
    async deleteMetric(id) {
        const m = await this.prisma.caseStudyMetric.findUnique({ where: { id } });
        this.checkEntityExists(m, 'CaseStudyMetric', id);
        await this.prisma.caseStudyMetric.delete({ where: { id } });
        return { success: true };
    }
    // Before/After
    async addBeforeAfter(dto) {
        const study = await this.prisma.caseStudy.findUnique({ where: { id: dto.caseStudyId } });
        this.checkEntityExists(study, 'CaseStudy', dto.caseStudyId);
        return this.prisma.beforeAfterComparison.create({
            data: {
                title: dto.title || null,
                description: dto.description || null,
                beforeImageId: dto.beforeImageId,
                afterImageId: dto.afterImageId,
                caseStudyId: dto.caseStudyId,
                sortOrder: dto.sortOrder !== undefined ? dto.sortOrder : 0,
            },
            include: { beforeMedia: true, afterMedia: true },
        });
    }
    async deleteBeforeAfter(id) {
        const ba = await this.prisma.beforeAfterComparison.findUnique({ where: { id } });
        this.checkEntityExists(ba, 'BeforeAfterComparison', id);
        await this.prisma.beforeAfterComparison.delete({ where: { id } });
        return { success: true };
    }
};
exports.CaseStudiesService = CaseStudiesService;
exports.CaseStudiesService = CaseStudiesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], CaseStudiesService);
//# sourceMappingURL=case-studies.service.js.map