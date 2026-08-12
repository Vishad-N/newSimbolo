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
var ProfilesService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProfilesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const base_service_1 = require("../shared/abstractions/base.service");
const audit_service_1 = require("../shared/audit/audit.service");
let ProfilesService = ProfilesService_1 = class ProfilesService extends base_service_1.BaseService {
    prisma;
    auditService;
    constructor(prisma, auditService) {
        super(ProfilesService_1.name);
        this.prisma = prisma;
        this.auditService = auditService;
    }
    async getClientProfile(userId) {
        this.logger.debug(`Retrieving client profile for user: ${userId}`);
        let profile = await this.prisma.clientProfile.findUnique({
            where: { userId },
            include: {
                company: true,
            },
        });
        if (!profile) {
            profile = await this.prisma.clientProfile.create({
                data: {
                    userId,
                },
                include: { company: true },
            });
        }
        return profile;
    }
    async updateClientProfile(userId, dto) {
        this.logger.debug(`Updating client profile for user: ${userId}`);
        const existing = await this.getClientProfile(userId);
        const updated = await this.prisma.clientProfile.update({
            where: { userId },
            data: {
                ...dto,
                updatedBy: userId,
            },
            include: { company: true },
        });
        await this.auditService.logEvent({
            userId,
            action: 'CLIENT_PROFILE_UPDATED',
            entityType: 'ClientProfile',
            entityId: existing.id,
            oldValue: { gstNumber: existing.gstNumber, billingAddress: existing.billingAddress },
            newValue: dto,
        });
        return updated;
    }
};
exports.ProfilesService = ProfilesService;
exports.ProfilesService = ProfilesService = ProfilesService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        audit_service_1.AuditService])
], ProfilesService);
//# sourceMappingURL=profiles.service.js.map