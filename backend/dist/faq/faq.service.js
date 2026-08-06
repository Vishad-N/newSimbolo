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
exports.FaqService = void 0;
const common_1 = require("@nestjs/common");
const base_service_1 = require("../shared/abstractions/base.service");
const prisma_service_1 = require("../prisma/prisma.service");
const client_1 = require("@prisma/client");
const custom_exceptions_1 = require("../common/exceptions/custom.exceptions");
let FaqService = class FaqService extends base_service_1.BaseService {
    prisma;
    constructor(prisma) {
        super('FaqService');
        this.prisma = prisma;
    }
    generateSlug(text) {
        return text
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '');
    }
    async getFaqs(categoryId, serviceId, isFeatured, search, status) {
        const where = { deletedAt: null };
        if (status) {
            where.status = status;
        }
        else {
            where.status = client_1.FAQStatusEnum.PUBLISHED;
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
                { question: { contains: search, mode: 'insensitive' } },
                { answer: { contains: search, mode: 'insensitive' } },
            ];
        }
        return this.prisma.fAQ.findMany({
            where,
            include: {
                category: true,
                service: { select: { id: true, name: true, slug: true } },
            },
            orderBy: { sortOrder: 'asc' },
        });
    }
    async getFaqById(id) {
        const faq = await this.prisma.fAQ.findUnique({
            where: { id },
            include: { category: true, service: true },
        });
        return this.checkEntityExists(faq, 'FAQ', id);
    }
    async createFaq(dto, createdBy) {
        if (dto.categoryId) {
            const c = await this.prisma.fAQCategory.findUnique({ where: { id: dto.categoryId } });
            this.checkEntityExists(c, 'FAQCategory', dto.categoryId);
        }
        if (dto.serviceId) {
            const s = await this.prisma.service.findUnique({ where: { id: dto.serviceId } });
            this.checkEntityExists(s, 'Service', dto.serviceId);
        }
        const created = await this.prisma.fAQ.create({
            data: {
                question: dto.question,
                answer: dto.answer,
                status: dto.status || client_1.FAQStatusEnum.PUBLISHED,
                isFeatured: dto.isFeatured !== undefined ? dto.isFeatured : false,
                sortOrder: dto.sortOrder !== undefined ? dto.sortOrder : 0,
                categoryId: dto.categoryId || null,
                serviceId: dto.serviceId || null,
                createdBy: createdBy || null,
            },
            include: { category: true, service: true },
        });
        this.logger.log(`Created FAQ "${created.question}" (ID: ${created.id})`);
        return created;
    }
    async updateFaq(id, dto, updatedBy) {
        const faq = await this.prisma.fAQ.findUnique({ where: { id } });
        this.checkEntityExists(faq, 'FAQ', id);
        return this.prisma.fAQ.update({
            where: { id },
            data: {
                ...(dto.question !== undefined && { question: dto.question }),
                ...(dto.answer !== undefined && { answer: dto.answer }),
                ...(dto.status !== undefined && { status: dto.status }),
                ...(dto.isFeatured !== undefined && { isFeatured: dto.isFeatured }),
                ...(dto.sortOrder !== undefined && { sortOrder: dto.sortOrder }),
                ...(dto.categoryId !== undefined && { categoryId: dto.categoryId }),
                ...(dto.serviceId !== undefined && { serviceId: dto.serviceId }),
                updatedBy: updatedBy || null,
            },
            include: { category: true, service: true },
        });
    }
    async deleteFaq(id, deletedBy) {
        const faq = await this.prisma.fAQ.findUnique({ where: { id } });
        this.checkEntityExists(faq, 'FAQ', id);
        await this.prisma.fAQ.update({
            where: { id },
            data: { deletedAt: new Date(), updatedBy: deletedBy || null },
        });
        this.logger.log(`Soft-deleted FAQ ID: ${id}`);
        return { success: true };
    }
    // Categories
    async getCategories() {
        return this.prisma.fAQCategory.findMany({
            where: { deletedAt: null },
            include: { _count: { select: { faqs: true } } },
            orderBy: { sortOrder: 'asc' },
        });
    }
    async createCategory(dto) {
        const slug = this.generateSlug(dto.name);
        const existing = await this.prisma.fAQCategory.findUnique({ where: { slug } });
        if (existing) {
            throw new custom_exceptions_1.CustomConflictException(`Category "${dto.name}" already exists`);
        }
        return this.prisma.fAQCategory.create({
            data: {
                name: dto.name,
                slug,
                description: dto.description || null,
                sortOrder: dto.sortOrder !== undefined ? dto.sortOrder : 0,
            },
        });
    }
    async deleteCategory(id) {
        const c = await this.prisma.fAQCategory.findUnique({ where: { id } });
        this.checkEntityExists(c, 'FAQCategory', id);
        await this.prisma.fAQCategory.update({
            where: { id },
            data: { deletedAt: new Date() },
        });
        return { success: true };
    }
};
exports.FaqService = FaqService;
exports.FaqService = FaqService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], FaqService);
//# sourceMappingURL=faq.service.js.map