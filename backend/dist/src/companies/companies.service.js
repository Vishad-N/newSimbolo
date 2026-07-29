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
exports.CompaniesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const base_service_1 = require("../shared/abstractions/base.service");
let CompaniesService = class CompaniesService extends base_service_1.BaseService {
    prisma;
    constructor(prisma) {
        super('CompaniesService');
        this.prisma = prisma;
    }
    generateSlug(text) {
        return text
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '');
    }
    companyInclude = {
        clients: {
            where: { deletedAt: null },
            include: {
                user: { select: { id: true, firstName: true, lastName: true, email: true } },
            },
        },
        _count: { select: { clients: true, documents: true } },
    };
    async findAll(search, industry, page = 1, limit = 20) {
        const where = { deletedAt: null };
        if (industry)
            where.industry = industry;
        if (search) {
            where.OR = [
                { name: { contains: search, mode: 'insensitive' } },
                { industry: { contains: search, mode: 'insensitive' } },
            ];
        }
        const [data, total] = await Promise.all([
            this.prisma.company.findMany({
                where,
                include: { _count: { select: { clients: true } } },
                skip: (page - 1) * limit,
                take: limit,
                orderBy: { name: 'asc' },
            }),
            this.prisma.company.count({ where }),
        ]);
        return { data, meta: { total, page, limit, totalPages: Math.ceil(total / limit) } };
    }
    async findOne(id) {
        const company = await this.prisma.company.findFirst({
            where: { id, deletedAt: null },
            include: this.companyInclude,
        });
        return this.checkEntityExists(company, 'Company', id);
    }
    async findBySlug(slug) {
        const company = await this.prisma.company.findFirst({
            where: { slug, deletedAt: null },
            include: this.companyInclude,
        });
        return this.checkEntityExists(company, 'Company', slug);
    }
    async create(dto, createdBy) {
        const slug = this.generateSlug(dto.name);
        const existing = await this.prisma.company.findUnique({ where: { slug } });
        if (existing)
            throw new common_1.ConflictException(`A company with the name "${dto.name}" already exists`);
        return this.prisma.company.create({
            data: {
                name: dto.name,
                slug,
                website: dto.website ?? null,
                industry: dto.industry ?? null,
                size: dto.size ?? null,
                logoUrl: dto.logoUrl ?? null,
                gstNumber: dto.gstNumber ?? null,
                billingAddress: dto.billingAddress ?? null,
                createdBy: createdBy ?? null,
            },
            include: this.companyInclude,
        });
    }
    async update(id, dto, updatedBy) {
        await this.findOne(id);
        if (dto.name) {
            const slug = this.generateSlug(dto.name);
            const existing = await this.prisma.company.findFirst({ where: { slug, NOT: { id } } });
            if (existing)
                throw new common_1.ConflictException(`A company with the name "${dto.name}" already exists`);
        }
        return this.prisma.company.update({
            where: { id },
            data: {
                ...(dto.name && { name: dto.name, slug: this.generateSlug(dto.name) }),
                ...(dto.website !== undefined && { website: dto.website }),
                ...(dto.industry !== undefined && { industry: dto.industry }),
                ...(dto.size !== undefined && { size: dto.size }),
                ...(dto.logoUrl !== undefined && { logoUrl: dto.logoUrl }),
                ...(dto.gstNumber !== undefined && { gstNumber: dto.gstNumber }),
                ...(dto.billingAddress !== undefined && { billingAddress: dto.billingAddress }),
                updatedBy: updatedBy ?? null,
            },
            include: this.companyInclude,
        });
    }
    async softDelete(id, deletedBy) {
        await this.findOne(id);
        await this.prisma.company.update({ where: { id }, data: { deletedAt: new Date(), updatedBy: deletedBy ?? null } });
        return { message: `Company ${id} has been deleted` };
    }
};
exports.CompaniesService = CompaniesService;
exports.CompaniesService = CompaniesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], CompaniesService);
//# sourceMappingURL=companies.service.js.map