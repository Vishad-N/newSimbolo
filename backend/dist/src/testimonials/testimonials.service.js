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
exports.TestimonialsService = void 0;
const common_1 = require("@nestjs/common");
const base_service_1 = require("../shared/abstractions/base.service");
const prisma_service_1 = require("../prisma/prisma.service");
const client_1 = require("@prisma/client");
let TestimonialsService = class TestimonialsService extends base_service_1.BaseService {
    prisma;
    constructor(prisma) {
        super('TestimonialsService');
        this.prisma = prisma;
    }
    async getTestimonials(isFeatured, clientId, caseStudyId, status) {
        const where = { deletedAt: null };
        if (status) {
            where.status = status;
        }
        else {
            where.status = client_1.TestimonialStatusEnum.APPROVED;
        }
        if (isFeatured !== undefined) {
            where.isFeatured = isFeatured;
        }
        if (clientId) {
            where.clientId = clientId;
        }
        if (caseStudyId) {
            where.caseStudyId = caseStudyId;
        }
        return this.prisma.testimonial.findMany({
            where,
            include: {
                client: { select: { id: true, company: { select: { name: true, industry: true } } } },
                caseStudy: { select: { id: true, title: true, slug: true } },
            },
            orderBy: { createdAt: 'desc' },
        });
    }
    async getTestimonialById(id) {
        const test = await this.prisma.testimonial.findUnique({
            where: { id },
            include: { client: true, caseStudy: true },
        });
        return this.checkEntityExists(test, 'Testimonial', id);
    }
    async createTestimonial(dto, createdBy) {
        if (dto.clientId) {
            const c = await this.prisma.clientProfile.findUnique({ where: { id: dto.clientId } });
            this.checkEntityExists(c, 'ClientProfile', dto.clientId);
        }
        if (dto.caseStudyId) {
            const s = await this.prisma.caseStudy.findUnique({ where: { id: dto.caseStudyId } });
            this.checkEntityExists(s, 'CaseStudy', dto.caseStudyId);
        }
        const created = await this.prisma.testimonial.create({
            data: {
                clientName: dto.clientName,
                clientTitle: dto.clientTitle || null,
                companyName: dto.companyName || null,
                content: dto.content,
                rating: dto.rating !== undefined ? dto.rating : 5,
                status: dto.status || client_1.TestimonialStatusEnum.APPROVED,
                isFeatured: dto.isFeatured !== undefined ? dto.isFeatured : false,
                isVerified: dto.isVerified !== undefined ? dto.isVerified : true,
                avatarUrl: dto.avatarUrl || null,
                videoReviewUrl: dto.videoReviewUrl || null,
                clientId: dto.clientId || null,
                caseStudyId: dto.caseStudyId || null,
                createdBy: createdBy || null,
            },
            include: { client: true, caseStudy: true },
        });
        this.logger.log(`Created testimonial from "${created.clientName}" (ID: ${created.id})`);
        return created;
    }
    async updateTestimonial(id, dto, updatedBy) {
        const test = this.checkEntityExists(await this.prisma.testimonial.findUnique({ where: { id } }), 'Testimonial', id);
        return this.prisma.testimonial.update({
            where: { id },
            data: {
                ...(dto.clientName !== undefined && { clientName: dto.clientName }),
                ...(dto.clientTitle !== undefined && { clientTitle: dto.clientTitle }),
                ...(dto.companyName !== undefined && { companyName: dto.companyName }),
                ...(dto.content !== undefined && { content: dto.content }),
                ...(dto.rating !== undefined && { rating: dto.rating }),
                ...(dto.status !== undefined && { status: dto.status }),
                ...(dto.isFeatured !== undefined && { isFeatured: dto.isFeatured }),
                ...(dto.isVerified !== undefined && { isVerified: dto.isVerified }),
                ...(dto.avatarUrl !== undefined && { avatarUrl: dto.avatarUrl }),
                ...(dto.videoReviewUrl !== undefined && { videoReviewUrl: dto.videoReviewUrl }),
                ...(dto.clientId !== undefined && { clientId: dto.clientId }),
                ...(dto.caseStudyId !== undefined && { caseStudyId: dto.caseStudyId }),
                updatedBy: updatedBy || null,
            },
            include: { client: true, caseStudy: true },
        });
    }
    async deleteTestimonial(id, deletedBy) {
        const test = await this.prisma.testimonial.findUnique({ where: { id } });
        this.checkEntityExists(test, 'Testimonial', id);
        await this.prisma.testimonial.update({
            where: { id },
            data: { deletedAt: new Date(), updatedBy: deletedBy || null },
        });
        this.logger.log(`Soft-deleted testimonial ID: ${id}`);
        return { success: true };
    }
};
exports.TestimonialsService = TestimonialsService;
exports.TestimonialsService = TestimonialsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], TestimonialsService);
//# sourceMappingURL=testimonials.service.js.map