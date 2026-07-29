import { AutomationService } from './automation.service';
import { CreateAutomationRuleDto, ExecuteAutomationDto, UpdateAutomationRuleDto } from './dto/automation.dto';
export declare class AutomationController {
    private readonly automationService;
    constructor(automationService: AutomationService);
    create(dto: CreateAutomationRuleDto): Promise<import("./dto/automation.dto").AutomationRule>;
    findAll(): Promise<{
        data: import("./dto/automation.dto").AutomationRule[];
        meta: {
            total: number;
        };
    }>;
    update(id: string, dto: UpdateAutomationRuleDto): Promise<import("./dto/automation.dto").AutomationRule>;
    remove(id: string): Promise<{
        message: string;
    }>;
    execute(dto: ExecuteAutomationDto): Promise<{
        trigger: import("./dto/automation.dto").AutomationTrigger;
        matchedRules: number;
        executions: {
            ruleId: string;
            action: import("./dto/automation.dto").AutomationActionType;
            status: string;
        }[];
    }>;
}
