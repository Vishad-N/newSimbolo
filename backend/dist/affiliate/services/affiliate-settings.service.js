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
const cache_service_1 = require("../../cache/cache.service");
const CACHE_KEY = 'affiliate-settings';
const CACHE_TTL_SECONDS = 300;
/**
 * Singleton settings accessor for the affiliate/commission program.
 *
 * The migration seeds exactly one row; this service is defensive and will create
 * the default row if the table is somehow empty (fresh test DBs, manual truncation).
 *
 * get() is on nearly every affiliate/commission/payment-webhook code path
 * (employee creation, commission settlement, the sweep, checkout code validation),
 * so it's cached with a short TTL rather than hitting the DB every time — this
 * setting changes rarely and a few minutes of staleness is a non-issue.
 */
let AffiliateSettingsService = class AffiliateSettingsService extends base_service_1.BaseService {
    prisma;
    auditService;
    cache;
    constructor(prisma, auditService, cache) {
        super('AffiliateSettingsService');
        this.prisma = prisma;
        this.auditService = auditService;
        this.cache = cache;
    }
    async get() {
        const cached = await this.cache.get(CACHE_KEY);
        if (cached)
            return cached;
        let settings = await this.prisma.affiliateSettings.findFirst({ orderBy: { updatedAt: 'asc' } });
        if (!settings) {
            this.logger.warn('No AffiliateSettings row found — creating program defaults');
            settings = await this.prisma.affiliateSettings.create({ data: {} });
        }
        await this.cache.set(CACHE_KEY, settings, CACHE_TTL_SECONDS);
        return settings;
    }
    async update(dto, actorUserId) {
        const current = await this.get();
        const updated = await this.prisma.affiliateSettings.update({
            where: { id: current.id },
            data: { ...dto, updatedBy: actorUserId ?? null },
        });
        await this.cache.deleteByPrefix(CACHE_KEY);
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
        audit_service_1.AuditService,
        cache_service_1.CacheService])
], AffiliateSettingsService);
//# sourceMappingURL=affiliate-settings.service.js.map