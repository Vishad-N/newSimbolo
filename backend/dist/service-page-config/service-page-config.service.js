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
exports.ServicePageConfigService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let ServicePageConfigService = class ServicePageConfigService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findByServiceSlug(slug) {
        const service = await this.prisma.service.findUnique({
            where: { slug },
            select: { id: true },
        });
        if (!service) {
            throw new common_1.NotFoundException(`Service with slug ${slug} not found`);
        }
        return this.prisma.servicePageConfig.findUnique({
            where: { serviceId: service.id },
        });
    }
    async upsert(slug, dto) {
        const service = await this.prisma.service.findUnique({
            where: { slug },
            select: { id: true },
        });
        if (!service) {
            throw new common_1.NotFoundException(`Service with slug ${slug} not found`);
        }
        const data = {
            heroBenefits: dto.heroBenefits || undefined,
            statsBar: dto.statsBar || undefined,
            servicesList: dto.servicesList || undefined,
            resultMetrics: dto.resultMetrics || undefined,
        };
        return this.prisma.servicePageConfig.upsert({
            where: { serviceId: service.id },
            update: data,
            create: {
                service: { connect: { id: service.id } },
                heroBenefits: dto.heroBenefits || [],
                statsBar: dto.statsBar || [],
                servicesList: dto.servicesList || [],
                resultMetrics: dto.resultMetrics || [],
            },
        });
    }
};
exports.ServicePageConfigService = ServicePageConfigService;
exports.ServicePageConfigService = ServicePageConfigService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ServicePageConfigService);
//# sourceMappingURL=service-page-config.service.js.map