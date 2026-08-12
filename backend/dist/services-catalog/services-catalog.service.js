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
exports.ServicesCatalogService = void 0;
const common_1 = require("@nestjs/common");
const base_service_1 = require("../shared/abstractions/base.service");
const prisma_service_1 = require("../prisma/prisma.service");
const custom_exceptions_1 = require("../common/exceptions/custom.exceptions");
let ServicesCatalogService = class ServicesCatalogService extends base_service_1.BaseService {
    prisma;
    constructor(prisma) {
        super('ServicesCatalogService');
        this.prisma = prisma;
    }
    generateSlug(text) {
        return text
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '');
    }
    async getServices(categoryId, search) {
        const where = { deletedAt: null };
        if (categoryId) {
            where.categoryId = categoryId;
        }
        if (search) {
            where.OR = [
                { name: { contains: search, mode: 'insensitive' } },
                { shortDescription: { contains: search, mode: 'insensitive' } },
            ];
        }
        return this.prisma.service.findMany({
            where,
            include: {
                category: true,
                features: { orderBy: { sortOrder: 'asc' } },
                _count: { select: { packages: true, caseStudies: true } },
            },
            orderBy: { name: 'asc' },
        });
    }
    async getServiceBySlug(slug) {
        const service = await this.prisma.service.findUnique({
            where: { slug },
            include: {
                category: true,
                features: { orderBy: { sortOrder: 'asc' } },
                faqs: { orderBy: { sortOrder: 'asc' } },
                packages: { orderBy: { basePrice: 'asc' } },
            },
        });
        return this.checkEntityExists(service, 'Service', slug);
    }
    async createService(dto, createdBy) {
        const slug = this.generateSlug(dto.name);
        const existing = await this.prisma.service.findUnique({ where: { slug } });
        if (existing) {
            throw new custom_exceptions_1.CustomConflictException(`Service with name "${dto.name}" or slug "${slug}" already exists`);
        }
        if (dto.categoryId) {
            const cat = await this.prisma.serviceCategory.findUnique({ where: { id: dto.categoryId } });
            this.checkEntityExists(cat, 'ServiceCategory', dto.categoryId);
        }
        const created = await this.prisma.service.create({
            data: {
                name: dto.name,
                slug,
                shortDescription: dto.shortDescription,
                fullDescription: dto.fullDescription || null,
                iconUrl: dto.iconUrl || null,
                type: dto.type || 'RETAINER',
                basePrice: dto.basePrice !== undefined ? dto.basePrice : 0.0,
                categoryId: dto.categoryId || null,
                createdBy: createdBy || null,
            },
        });
        this.logger.log(`Created service "${created.name}" (ID: ${created.id})`);
        return created;
    }
    async updateService(id, dto, updatedBy) {
        const service = this.checkEntityExists(await this.prisma.service.findUnique({ where: { id } }), 'Service', id);
        if (dto.categoryId) {
            const cat = await this.prisma.serviceCategory.findUnique({ where: { id: dto.categoryId } });
            this.checkEntityExists(cat, 'ServiceCategory', dto.categoryId);
        }
        let slug = service.slug;
        if (dto.name && dto.name !== service.name) {
            slug = this.generateSlug(dto.name);
            const conflict = await this.prisma.service.findFirst({
                where: { slug, id: { not: id } },
            });
            if (conflict) {
                throw new custom_exceptions_1.CustomConflictException(`Service with name "${dto.name}" already exists`);
            }
        }
        return this.prisma.service.update({
            where: { id },
            data: {
                ...(dto.name !== undefined && { name: dto.name, slug }),
                ...(dto.shortDescription !== undefined && { shortDescription: dto.shortDescription }),
                ...(dto.fullDescription !== undefined && { fullDescription: dto.fullDescription }),
                ...(dto.iconUrl !== undefined && { iconUrl: dto.iconUrl }),
                ...(dto.type !== undefined && { type: dto.type }),
                ...(dto.basePrice !== undefined && { basePrice: dto.basePrice }),
                ...(dto.categoryId !== undefined && { categoryId: dto.categoryId }),
                updatedBy: updatedBy || null,
            },
        });
    }
    async deleteService(id, deletedBy) {
        const service = await this.prisma.service.findUnique({ where: { id } });
        this.checkEntityExists(service, 'Service', id);
        await this.prisma.service.update({
            where: { id },
            data: { deletedAt: new Date(), updatedBy: deletedBy || null },
        });
        this.logger.log(`Soft-deleted service ID: ${id}`);
        return { success: true };
    }
    // Categories
    async getCategories() {
        return this.prisma.serviceCategory.findMany({
            where: { deletedAt: null },
            include: { _count: { select: { services: true } } },
            orderBy: { sortOrder: 'asc' },
        });
    }
    async createCategory(dto, createdBy) {
        const slug = this.generateSlug(dto.name);
        const existing = await this.prisma.serviceCategory.findUnique({ where: { slug } });
        if (existing) {
            throw new custom_exceptions_1.CustomConflictException(`Category "${dto.name}" already exists`);
        }
        return this.prisma.serviceCategory.create({
            data: {
                name: dto.name,
                slug,
                description: dto.description || null,
                sortOrder: dto.sortOrder !== undefined ? dto.sortOrder : 0,
                createdBy: createdBy || null,
            },
        });
    }
    async deleteCategory(id) {
        const cat = await this.prisma.serviceCategory.findUnique({ where: { id } });
        this.checkEntityExists(cat, 'ServiceCategory', id);
        await this.prisma.serviceCategory.update({
            where: { id },
            data: { deletedAt: new Date() },
        });
        return { success: true };
    }
    // Features & FAQs
    async addFeature(dto) {
        const service = await this.prisma.service.findUnique({ where: { id: dto.serviceId } });
        this.checkEntityExists(service, 'Service', dto.serviceId);
        return this.prisma.serviceFeature.create({
            data: {
                name: dto.name,
                description: dto.description || null,
                serviceId: dto.serviceId,
                isIncluded: dto.isIncluded !== undefined ? dto.isIncluded : true,
                sortOrder: dto.sortOrder !== undefined ? dto.sortOrder : 0,
            },
        });
    }
    async deleteFeature(id) {
        const feat = await this.prisma.serviceFeature.findUnique({ where: { id } });
        this.checkEntityExists(feat, 'ServiceFeature', id);
        await this.prisma.serviceFeature.delete({ where: { id } });
        return { success: true };
    }
    async addFaq(dto) {
        const service = await this.prisma.service.findUnique({ where: { id: dto.serviceId } });
        this.checkEntityExists(service, 'Service', dto.serviceId);
        return this.prisma.serviceFAQ.create({
            data: {
                question: dto.question,
                answer: dto.answer,
                serviceId: dto.serviceId,
                sortOrder: dto.sortOrder !== undefined ? dto.sortOrder : 0,
            },
        });
    }
    async deleteFaq(id) {
        const faq = await this.prisma.serviceFAQ.findUnique({ where: { id } });
        this.checkEntityExists(faq, 'ServiceFAQ', id);
        await this.prisma.serviceFAQ.delete({ where: { id } });
        return { success: true };
    }
};
exports.ServicesCatalogService = ServicesCatalogService;
exports.ServicesCatalogService = ServicesCatalogService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ServicesCatalogService);
//# sourceMappingURL=services-catalog.service.js.map