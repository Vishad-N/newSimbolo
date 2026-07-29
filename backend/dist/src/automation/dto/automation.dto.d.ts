export declare enum AutomationTrigger {
    PROJECT_CREATED = "PROJECT_CREATED",
    ORDER_PAID = "ORDER_PAID",
    INVOICE_OVERDUE = "INVOICE_OVERDUE",
    MILESTONE_COMPLETED = "MILESTONE_COMPLETED",
    DELIVERABLE_APPROVED = "DELIVERABLE_APPROVED",
    TICKET_CLOSED = "TICKET_CLOSED",
    NEW_CLIENT_REGISTERED = "NEW_CLIENT_REGISTERED"
}
export declare enum AutomationActionType {
    SEND_EMAIL = "SEND_EMAIL",
    CREATE_TASK = "CREATE_TASK",
    ASSIGN_TEAM_MEMBER = "ASSIGN_TEAM_MEMBER",
    GENERATE_NOTIFICATION = "GENERATE_NOTIFICATION",
    UPDATE_STATUS = "UPDATE_STATUS",
    SCHEDULE_FOLLOW_UP = "SCHEDULE_FOLLOW_UP"
}
export declare class AutomationActionDto {
    type: AutomationActionType;
    config?: Record<string, string | number | boolean>;
}
export declare class CreateAutomationRuleDto {
    name: string;
    trigger: AutomationTrigger;
    enabled?: boolean;
    actions: AutomationActionDto[];
}
export declare class UpdateAutomationRuleDto extends CreateAutomationRuleDto {
}
export declare class ExecuteAutomationDto {
    trigger: AutomationTrigger;
    payload?: Record<string, string | number | boolean>;
}
export interface AutomationRule {
    id: string;
    name: string;
    trigger: AutomationTrigger;
    enabled: boolean;
    actions: AutomationActionDto[];
    createdAt: string;
    updatedAt: string;
}
