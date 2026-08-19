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
exports.AffiliateSettingsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
const base_service_1 = require("../../shared/abstractions/base.service");
const audit_service_1 = require("../../shared/audit/audit.service");
/**
 * Singleton settings accessor for the affiliate/commission program.
 *
 * The migration seeds exactly one row; this service is defensive and will create
 * the default row if the table is somehow empty (fresh test DBs, manual truncation).
 */
let AffiliateSettingsService = class AffiliateSettingsService extends base_service_1.BaseService {
    prisma;
    auditService;
    constructor(prisma, auditService) {
        super('AffiliateSettingsService');
        this.prisma = prisma;
        this.auditService = auditService;
    }
    async get() {
        const existing = await this.prisma.affiliateSettings.findFirst({ orderBy: { updatedAt: 'asc' } });
        if (existing)
            return existing;
        this.logger.warn('No AffiliateSettings row found — creating program defaults');
        return this.prisma.affiliateSettings.create({ data: {} });
    }
    async update(dto, actorUserId) {
        const current = await this.get();
        const updated = await this.prisma.affiliateSettings.update({
            where: { id: current.id },
            data: { ...dto, updatedBy: actorUserId ?? null },
        });
        await this.auditService.logEvent({
            action: 'affiliate.settings.updated',
            entityType: 'AffiliateSettings',
            entityId: current.id,
            oldValue: current,
            newValue: updated,
            userId: actorUserId,
        });
        return updated;
    }
};
exports.AffiliateSettingsService = AffiliateSettingsService;
exports.AffiliateSettingsService = AffiliateSettingsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        audit_service_1.AuditService])
], AffiliateSettingsService);
//# sourceMappingURL=affiliate-settings.service.js.map