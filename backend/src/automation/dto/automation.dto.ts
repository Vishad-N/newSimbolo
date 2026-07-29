import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsBoolean, IsEnum, IsObject, IsOptional, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export enum AutomationTrigger {
  PROJECT_CREATED = 'PROJECT_CREATED',
  ORDER_PAID = 'ORDER_PAID',
  INVOICE_OVERDUE = 'INVOICE_OVERDUE',
  MILESTONE_COMPLETED = 'MILESTONE_COMPLETED',
  DELIVERABLE_APPROVED = 'DELIVERABLE_APPROVED',
  TICKET_CLOSED = 'TICKET_CLOSED',
  NEW_CLIENT_REGISTERED = 'NEW_CLIENT_REGISTERED',
}

export enum AutomationActionType {
  SEND_EMAIL = 'SEND_EMAIL',
  CREATE_TASK = 'CREATE_TASK',
  ASSIGN_TEAM_MEMBER = 'ASSIGN_TEAM_MEMBER',
  GENERATE_NOTIFICATION = 'GENERATE_NOTIFICATION',
  UPDATE_STATUS = 'UPDATE_STATUS',
  SCHEDULE_FOLLOW_UP = 'SCHEDULE_FOLLOW_UP',
}

export class AutomationActionDto {
  @ApiProperty({ enum: AutomationActionType })
  @IsEnum(AutomationActionType)
  type: AutomationActionType;

  @ApiPropertyOptional({ example: { title: 'Follow up with client' } })
  @IsOptional()
  @IsObject()
  config?: Record<string, string | number | boolean>;
}

export class CreateAutomationRuleDto {
  @ApiProperty({ example: 'Notify admin when invoice is overdue' })
  @IsString()
  name: string;

  @ApiProperty({ enum: AutomationTrigger })
  @IsEnum(AutomationTrigger)
  trigger: AutomationTrigger;

  @ApiPropertyOptional({ default: true })
  @IsOptional()
  @IsBoolean()
  enabled?: boolean = true;

  @ApiProperty({ type: [AutomationActionDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AutomationActionDto)
  actions: AutomationActionDto[];
}

export class UpdateAutomationRuleDto extends CreateAutomationRuleDto {}

export class ExecuteAutomationDto {
  @ApiProperty({ enum: AutomationTrigger })
  @IsEnum(AutomationTrigger)
  trigger: AutomationTrigger;

  @ApiPropertyOptional({ example: { userId: 'uuid', projectId: 'uuid' } })
  @IsOptional()
  @IsObject()
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
