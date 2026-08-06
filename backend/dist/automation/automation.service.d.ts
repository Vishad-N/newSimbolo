import { PrismaService } from '../prisma/prisma.service';
import { BaseService } from '../shared/abstractions/base.service';
import { AutomationActionType, AutomationRule, CreateAutomationRuleDto, ExecuteAutomationDto, UpdateAutomationRuleDto } from './dto/automation.dto';
export declare class AutomationService extends BaseService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    private buildRule;
    create(dto: CreateAutomationRuleDto): Promise<AutomationRule>;
    findAll(): Promise<{
        data: AutomationRule[];
        meta: {
            total: number;
        };
    }>;
    update(id: string, dto: UpdateAutomationRuleDto): Promise<AutomationRule>;
    remove(id: string): Promise<{
        message: string;
    }>;
    execute(dto: ExecuteAutomationDto): Promise<{
        trigger: import("./dto/automation.dto").AutomationTrigger;
        matchedRules: number;
        executions: {
            ruleId: string;
            action: AutomationActionType;
            status: string;
        }[];
    }>;
    private findStoredRule;
    private executeAction;
}
