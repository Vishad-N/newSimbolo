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
exports.PackagesService = void 0;
const common_1 = require("@nestjs/common");
const base_service_1 = require("../shared/abstractions/base.service");
const prisma_service_1 = require("../prisma/prisma.service");
const custom_exceptions_1 = require("../common/exceptions/custom.exceptions");
let PackagesService = class PackagesService extends base_service_1.BaseService {
    prisma;
    constructor(prisma) {
        super('PackagesService');
        this.prisma = prisma;
    }
    generateSlug(text) {
        return text
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '');
    }
    async getPackages(serviceId, type) {
        const where = { deletedAt: null };
        if (serviceId) {
            where.serviceId = serviceId;
        }
        if (type) {
            where.type = type;
        }
        return this.prisma.package.findMany({
            where,
            include: {
                service: { select: { id: true, name: true, slug: true } },
                features: { orderBy: { sortOrder: 'asc' } },
                pricings: true,
                comparisons: { orderBy: { sortOrder: 'asc' } },
            },
            orderBy: { basePrice: 'asc' },
        });
    }
    async getPackageBySlug(slug) {
        const pkg = await this.prisma.package.findUnique({
            where: { slug },
            include: {
                service: true,
                features: { orderBy: { sortOrder: 'asc' } },
                pricings: true,
                comparisons: { orderBy: { sortOrder: 'asc' } },
            },
        });
        return this.checkEntityExists(pkg, 'Package', slug);
    }
    async createPackage(dto, createdBy) {
        const service = this.checkEntityExists(await this.prisma.service.findUnique({ where: { id: dto.serviceId } }), 'Service', dto.serviceId);
        // Prefixed with the service slug so the same tier name (e.g. "Starter", "Growth")
        // can be reused across different services — plain generateSlug(name) alone would
        // collide the moment a second service defines a package with the same name.
        const slug = `${service.slug}-${this.generateSlug(dto.name)}`;
        const existing = await this.prisma.package.findUnique({ where: { slug } });
        if (existing) {
            throw new custom_exceptions_1.CustomConflictException(`Package with name "${dto.name}" or slug "${slug}" already exists`);
        }
        const created = await this.prisma.package.create({
            data: {
                name: dto.name,
                slug,
                description: dto.description || null,
                illustration: dto.isAddon ? null : dto.illustration || null,
                thumbnailUrl: dto.isAddon ? null : dto.thumbnailUrl || null,
                type: dto.type || 'STARTER',
                serviceId: dto.serviceId,
                basePrice: dto.basePrice !== undefined ? dto.basePrice : 0.0,
                billingInterval: dto.billingInterval || 'monthly',
                isPopular: dto.isPopular !== undefined ? dto.isPopular : false,
                isAddon: dto.isAddon !== undefined ? dto.isAddon : false,
                isCustom: dto.isCustom !== undefined ? dto.isCustom : false,
                createdBy: createdBy || null,
            },
        });
        this.logger.log(`Created package "${created.name}" (ID: ${created.id})`);
        return created;
    }
    async updatePackage(id, dto, updatedBy) {
        const pkg = this.checkEntityExists(await this.prisma.package.findUnique({ where: { id }, include: { service: true } }), 'Package', id);
        let serviceSlug = pkg.service.slug;
        let serviceIdChanged = false;
        if (dto.serviceId && dto.serviceId !== pkg.serviceId) {
            const nextService = this.checkEntityExists(await this.prisma.service.findUnique({ where: { id: dto.serviceId } }), 'Service', dto.serviceId);
            serviceSlug = nextService.slug;
            serviceIdChanged = true;
        }
        let slug = pkg.slug;
        if ((dto.name && dto.name !== pkg.name) || serviceIdChanged) {
            slug = `${serviceSlug}-${this.generateSlug(dto.name || pkg.name)}`;
            const conflict = await this.prisma.package.findFirst({
                where: { slug, id: { not: id } },
            });
            if (conflict) {
                throw new custom_exceptions_1.CustomConflictException(`Package name "${dto.name || pkg.name}" already exists for this service`);
            }
        }
        const willBeAddon = dto.isAddon ?? pkg.isAddon;
        return this.prisma.package.update({
            where: { id },
            data: {
                ...(dto.name !== undefined && { name: dto.name, slug }),
                ...(dto.description !== undefined && { description: dto.description }),
                ...(willBeAddon
                    ? { illustration: null, thumbnailUrl: null }
                    : dto.illustration !== undefined && { illustration: dto.illustration }),
                ...(!willBeAddon && dto.thumbnailUrl !== undefined && { thumbnailUrl: dto.thumbnailUrl }),
                ...(dto.type !== undefined && { type: dto.type }),
                ...(dto.serviceId !== undefined && { serviceId: dto.serviceId }),
                ...(dto.basePrice !== undefined && { basePrice: dto.basePrice }),
                ...(dto.billingInterval !== undefined && { billingInterval: dto.billingInterval }),
                ...(dto.isPopular !== undefined && { isPopular: dto.isPopular }),
                ...(dto.isAddon !== undefined && { isAddon: dto.isAddon }),
                ...(dto.isCustom !== undefined && { isCustom: dto.isCustom }),
                updatedBy: updatedBy || null,
            },
        });
    }
    async deletePackage(id, deletedBy) {
        const pkg = await this.prisma.package.findUnique({ where: { id } });
        this.checkEntityExists(pkg, 'Package', id);
        await this.prisma.package.update({
            where: { id },
            data: { deletedAt: new Date(), updatedBy: deletedBy || null },
        });
        this.logger.log(`Soft-deleted package ID: ${id}`);
        return { success: true };
    }
    // Features CRUD
    async addFeature(dto) {
        const pkg = await this.prisma.package.findUnique({ where: { id: dto.packageId } });
        this.checkEntityExists(pkg, 'Package', dto.packageId);
        return this.prisma.packageFeature.create({
            data: {
                name: dto.name,
                description: dto.description || null,
                packageId: dto.packageId,
                isIncluded: dto.isIncluded !== undefined ? dto.isIncluded : true,
                kind: dto.kind || 'FEATURE',
                limitValue: dto.limitValue || null,
                sortOrder: dto.sortOrder !== undefined ? dto.sortOrder : 0,
            },
        });
    }
    async deleteFeature(id) {
        const feat = await this.prisma.packageFeature.findUnique({ where: { id } });
        this.checkEntityExists(feat, 'PackageFeature', id);
        await this.prisma.packageFeature.delete({ where: { id } });
        return { success: true };
    }
    // Pricings CRUD
    async upsertPricing(dto) {
        const pkg = await this.prisma.package.findUnique({ where: { id: dto.packageId } });
        this.checkEntityExists(pkg, 'Package', dto.packageId);
        const currency = dto.currency || 'INR';
        const billingPeriod = dto.billingPeriod || 'monthly';
        return this.prisma.packagePricing.upsert({
            where: {
                packageId_currency_billingPeriod: {
                    packageId: dto.packageId,
                    currency,
                    billingPeriod,
                },
            },
            create: {
                packageId: dto.packageId,
                currency,
                price: dto.price,
                billingPeriod,
                discountPercentage: dto.discountPercentage !== undefined ? dto.discountPercentage : 0.0,
            },
            update: {
                price: dto.price,
                ...(dto.discountPercentage !== undefined && { discountPercentage: dto.discountPercentage }),
            },
        });
    }
    async deletePricing(id) {
        const pricing = await this.prisma.packagePricing.findUnique({ where: { id } });
        this.checkEntityExists(pricing, 'PackagePricing', id);
        await this.prisma.packagePricing.delete({ where: { id } });
        return { success: true };
    }
};
exports.PackagesService = PackagesService;
exports.PackagesService = PackagesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], PackagesService);
//# sourceMappingURL=packages.service.js.map