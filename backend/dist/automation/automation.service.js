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
exports.AutomationService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const base_service_1 = require("../shared/abstractions/base.service");
const automation_dto_1 = require("./dto/automation.dto");
let AutomationService = class AutomationService extends base_service_1.BaseService {
    prisma;
    constructor(prisma) {
        super('AutomationService');
        this.prisma = prisma;
    }
    buildRule(id, dto, createdAt = new Date().toISOString()) {
        return {
            id,
            name: dto.name,
            trigger: dto.trigger,
            enabled: dto.enabled ?? true,
            actions: dto.actions,
            createdAt,
            updatedAt: new Date().toISOString(),
        };
    }
    async create(dto) {
        const id = `rule-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;
        const rule = this.buildRule(id, dto);
        await this.prisma.globalSetting.create({
            data: {
                key: `automation:${id}`,
                value: JSON.stringify(rule),
                category: 'AUTOMATION_RULE',
                description: rule.name,
                isPublic: false,
            },
        });
        return rule;
    }
    async findAll() {
        const records = await this.prisma.globalSetting.findMany({
            where: { category: 'AUTOMATION_RULE' },
            orderBy: { updatedAt: 'desc' },
        });
        return {
            data: records.map((record) => JSON.parse(record.value)),
            meta: { total: records.length },
        };
    }
    async update(id, dto) {
        const existing = await this.findStoredRule(id);
        const rule = this.buildRule(id, dto, existing.createdAt);
        await this.prisma.globalSetting.update({
            where: { key: `automation:${id}` },
            data: { value: JSON.stringify(rule), description: rule.name },
        });
        return rule;
    }
    async remove(id) {
        await this.findStoredRule(id);
        await this.prisma.globalSetting.delete({ where: { key: `automation:${id}` } });
        return { message: `Automation rule ${id} deleted` };
    }
    async execute(dto) {
        const records = await this.prisma.globalSetting.findMany({ where: { category: 'AUTOMATION_RULE' } });
        const rules = records
            .map((record) => JSON.parse(record.value))
            .filter((rule) => rule.enabled && rule.trigger === dto.trigger);
        const executions = [];
        for (const rule of rules) {
            for (const action of rule.actions) {
                await this.executeAction(action.type, action.config ?? {}, dto.payload ?? {});
                executions.push({ ruleId: rule.id, action: action.type, status: 'EXECUTED' });
            }
        }
        await this.prisma.auditLog.create({
            data: {
                action: 'AUTOMATION_EXECUTED',
                entityType: 'AUTOMATION',
                entityId: dto.trigger,
                newValue: JSON.stringify({ trigger: dto.trigger, executions }),
            },
        });
        return { trigger: dto.trigger, matchedRules: rules.length, executions };
    }
    async findStoredRule(id) {
        const record = await this.prisma.globalSetting.findUnique({ where: { key: `automation:${id}` } });
        if (!record)
            throw new common_1.NotFoundException(`Automation rule ${id} not found`);
        return JSON.parse(record.value);
    }
    async executeAction(type, config, payload) {
        if (type === automation_dto_1.AutomationActionType.GENERATE_NOTIFICATION && typeof payload.userId === 'string') {
            await this.prisma.notification.create({
                data: {
                    userId: payload.userId,
                    title: String(config.title ?? 'Automation notification'),
                    message: String(config.message ?? 'An automated workflow was triggered.'),
                    type: 'SYSTEM',
                    channel: 'IN_APP',
                    deepLink: typeof config.deepLink === 'string' ? config.deepLink : null,
                },
            });
            return;
        }
        if (type === automation_dto_1.AutomationActionType.CREATE_TASK && typeof payload.projectId === 'string') {
            await this.prisma.task.create({
                data: {
                    projectId: payload.projectId,
                    title: String(config.title ?? 'Automated follow-up'),
                    description: typeof config.description === 'string' ? config.description : null,
                    priority: 'MEDIUM',
                    status: 'TODO',
                },
            });
            return;
        }
        await this.prisma.timeline.create({
            data: {
                title: `Automation action: ${type}`,
                description: JSON.stringify({ config, payload }),
                eventType: `AUTOMATION_${type}`,
                projectId: typeof payload.projectId === 'string' ? payload.projectId : undefined,
                clientId: typeof payload.clientId === 'string' ? payload.clientId : undefined,
                userId: typeof payload.userId === 'string' ? payload.userId : undefined,
            },
        });
    }
};
exports.AutomationService = AutomationService;
exports.AutomationService = AutomationService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AutomationService);
//# sourceMappingURL=automation.service.js.map