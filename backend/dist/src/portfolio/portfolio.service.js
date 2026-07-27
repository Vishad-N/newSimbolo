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
exports.PortfolioService = void 0;
const common_1 = require("@nestjs/common");
const base_service_1 = require("../shared/abstractions/base.service");
const prisma_service_1 = require("../prisma/prisma.service");
const client_1 = require("@prisma/client");
const custom_exceptions_1 = require("../common/exceptions/custom.exceptions");
let PortfolioService = class PortfolioService extends base_service_1.BaseService {
    prisma;
    constructor(prisma) {
        super('PortfolioService');
        this.prisma = prisma;
    }
    generateSlug(text) {
        return text
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '');
    }
    async getProjects(categoryId, serviceId, isFeatured, search, status) {
        const where = { deletedAt: null };
        if (status) {
            where.status = status;
        }
        else {
            where.status = client_1.PortfolioStatusEnum.PUBLISHED;
        }
        if (categoryId) {
            where.categoryId = categoryId;
        }
        if (serviceId) {
            where.serviceId = serviceId;
        }
        if (isFeatured !== undefined) {
            where.isFeatured = isFeatured;
        }
        if (search) {
            where.OR = [
                { title: { contains: search, mode: 'insensitive' } },
                { clientName: { contains: search, mode: 'insensitive' } },
                { description: { contains: search, mode: 'insensitive' } },
            ];
        }
        return this.prisma.portfolioProject.findMany({
            where,
            include: {
                category: true,
                service: { select: { id: true, name: true, slug: true } },
                coverImage: true,
            },
            orderBy: { createdAt: 'desc' },
        });
    }
    async getProjectBySlug(slug) {
        const proj = await this.prisma.portfolioProject.findUnique({
            where: { slug },
            include: {
                category: true,
                service: true,
                coverImage: true,
            },
        });
        return this.checkEntityExists(proj, 'PortfolioProject', slug);
    }
    async createProject(dto, createdBy) {
        const slug = this.generateSlug(dto.title);
        const existing = await this.prisma.portfolioProject.findUnique({ where: { slug } });
        if (existing) {
            throw new custom_exceptions_1.CustomConflictException(`Project "${dto.title}" or slug "${slug}" already exists`);
        }
        if (dto.serviceId) {
            const s = await this.prisma.service.findUnique({ where: { id: dto.serviceId } });
            this.checkEntityExists(s, 'Service', dto.serviceId);
        }
        if (dto.categoryId) {
            const c = await this.prisma.portfolioCategory.findUnique({ where: { id: dto.categoryId } });
            this.checkEntityExists(c, 'PortfolioCategory', dto.categoryId);
        }
        const created = await this.prisma.portfolioProject.create({
            data: {
                title: dto.title,
                slug,
                description: dto.description || null,
                clientName: dto.clientName || null,
                liveUrl: dto.liveUrl || null,
                completionDate: dto.completionDate ? new Date(dto.completionDate) : null,
                status: dto.status || client_1.PortfolioStatusEnum.PUBLISHED,
                isFeatured: dto.isFeatured !== undefined ? dto.isFeatured : false,
                serviceId: dto.serviceId || null,
                categoryId: dto.categoryId || null,
                coverImageId: dto.coverImageId || null,
                createdBy: createdBy || null,
            },
            include: { category: true, service: true, coverImage: true },
        });
        this.logger.log(`Created portfolio project "${created.title}" (ID: ${created.id})`);
        return created;
    }
    async updateProject(id, dto, updatedBy) {
        const proj = this.checkEntityExists(await this.prisma.portfolioProject.findUnique({ where: { id } }), 'PortfolioProject', id);
        let slug = proj.slug;
        if (dto.title && dto.title !== proj.title) {
            slug = this.generateSlug(dto.title);
            const conflict = await this.prisma.portfolioProject.findFirst({ where: { slug, id: { not: id } } });
            if (conflict) {
                throw new custom_exceptions_1.CustomConflictException(`Project title "${dto.title}" already exists`);
            }
        }
        return this.prisma.portfolioProject.update({
            where: { id },
            data: {
                ...(dto.title !== undefined && { title: dto.title, slug }),
                ...(dto.description !== undefined && { description: dto.description }),
                ...(dto.clientName !== undefined && { clientName: dto.clientName }),
                ...(dto.liveUrl !== undefined && { liveUrl: dto.liveUrl }),
                ...(dto.completionDate !== undefined && {
                    completionDate: dto.completionDate ? new Date(dto.completionDate) : null,
                }),
                ...(dto.status !== undefined && { status: dto.status }),
                ...(dto.isFeatured !== undefined && { isFeatured: dto.isFeatured }),
                ...(dto.serviceId !== undefined && { serviceId: dto.serviceId }),
                ...(dto.categoryId !== undefined && { categoryId: dto.categoryId }),
                ...(dto.coverImageId !== undefined && { coverImageId: dto.coverImageId }),
                updatedBy: updatedBy || null,
            },
            include: { category: true, service: true, coverImage: true },
        });
    }
    async deleteProject(id, deletedBy) {
        const proj = await this.prisma.portfolioProject.findUnique({ where: { id } });
        this.checkEntityExists(proj, 'PortfolioProject', id);
        await this.prisma.portfolioProject.update({
            where: { id },
            data: { deletedAt: new Date(), updatedBy: deletedBy || null },
        });
        this.logger.log(`Soft-deleted portfolio project ID: ${id}`);
        return { success: true };
    }
    // Categories
    async getCategories() {
        return this.prisma.portfolioCategory.findMany({
            where: { deletedAt: null },
            include: { _count: { select: { projects: true } } },
            orderBy: { name: 'asc' },
        });
    }
    async createCategory(dto) {
        const slug = this.generateSlug(dto.name);
        const existing = await this.prisma.portfolioCategory.findUnique({ where: { slug } });
        if (existing) {
            throw new custom_exceptions_1.CustomConflictException(`Category "${dto.name}" already exists`);
        }
        return this.prisma.portfolioCategory.create({
            data: { name: dto.name, slug, description: dto.description || null },
        });
    }
    async deleteCategory(id) {
        const c = await this.prisma.portfolioCategory.findUnique({ where: { id } });
        this.checkEntityExists(c, 'PortfolioCategory', id);
        await this.prisma.portfolioCategory.update({
            where: { id },
            data: { deletedAt: new Date() },
        });
        return { success: true };
    }
};
exports.PortfolioService = PortfolioService;
exports.PortfolioService = PortfolioService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], PortfolioService);
//# sourceMappingURL=portfolio.service.js.map