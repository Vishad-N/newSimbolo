import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { BaseService } from '../shared/abstractions/base.service';
import {
  AutomationActionType,
  AutomationRule,
  CreateAutomationRuleDto,
  ExecuteAutomationDto,
  UpdateAutomationRuleDto,
} from './dto/automation.dto';

@Injectable()
export class AutomationService extends BaseService {
  constructor(private readonly prisma: PrismaService) {
    super('AutomationService');
  }

  private buildRule(id: string, dto: CreateAutomationRuleDto, createdAt = new Date().toISOString()): AutomationRule {
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

  async create(dto: CreateAutomationRuleDto) {
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
      data: records.map((record) => JSON.parse(record.value) as AutomationRule),
      meta: { total: records.length },
    };
  }

  async update(id: string, dto: UpdateAutomationRuleDto) {
    const existing = await this.findStoredRule(id);
    const rule = this.buildRule(id, dto, existing.createdAt);
    await this.prisma.globalSetting.update({
      where: { key: `automation:${id}` },
      data: { value: JSON.stringify(rule), description: rule.name },
    });
    return rule;
  }

  async remove(id: string) {
    await this.findStoredRule(id);
    await this.prisma.globalSetting.delete({ where: { key: `automation:${id}` } });
    return { message: `Automation rule ${id} deleted` };
  }

  async execute(dto: ExecuteAutomationDto) {
    const records = await this.prisma.globalSetting.findMany({ where: { category: 'AUTOMATION_RULE' } });
    const rules = records
      .map((record) => JSON.parse(record.value) as AutomationRule)
      .filter((rule) => rule.enabled && rule.trigger === dto.trigger);

    const executions: { ruleId: string; action: AutomationActionType; status: string }[] = [];
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

  private async findStoredRule(id: string): Promise<AutomationRule> {
    const record = await this.prisma.globalSetting.findUnique({ where: { key: `automation:${id}` } });
    if (!record) throw new NotFoundException(`Automation rule ${id} not found`);
    return JSON.parse(record.value) as AutomationRule;
  }

  private async executeAction(
    type: AutomationActionType,
    config: Record<string, string | number | boolean>,
    payload: Record<string, string | number | boolean>,
  ) {
    if (type === AutomationActionType.GENERATE_NOTIFICATION && typeof payload.userId === 'string') {
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

    if (type === AutomationActionType.CREATE_TASK && typeof payload.projectId === 'string') {
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
}
