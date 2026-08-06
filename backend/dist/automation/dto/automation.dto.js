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
exports.ExecuteAutomationDto = exports.UpdateAutomationRuleDto = exports.CreateAutomationRuleDto = exports.AutomationActionDto = exports.AutomationActionType = exports.AutomationTrigger = void 0;
const openapi = require("@nestjs/swagger");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
var AutomationTrigger;
(function (AutomationTrigger) {
    AutomationTrigger["PROJECT_CREATED"] = "PROJECT_CREATED";
    AutomationTrigger["ORDER_PAID"] = "ORDER_PAID";
    AutomationTrigger["INVOICE_OVERDUE"] = "INVOICE_OVERDUE";
    AutomationTrigger["MILESTONE_COMPLETED"] = "MILESTONE_COMPLETED";
    AutomationTrigger["DELIVERABLE_APPROVED"] = "DELIVERABLE_APPROVED";
    AutomationTrigger["TICKET_CLOSED"] = "TICKET_CLOSED";
    AutomationTrigger["NEW_CLIENT_REGISTERED"] = "NEW_CLIENT_REGISTERED";
})(AutomationTrigger || (exports.AutomationTrigger = AutomationTrigger = {}));
var AutomationActionType;
(function (AutomationActionType) {
    AutomationActionType["SEND_EMAIL"] = "SEND_EMAIL";
    AutomationActionType["CREATE_TASK"] = "CREATE_TASK";
    AutomationActionType["ASSIGN_TEAM_MEMBER"] = "ASSIGN_TEAM_MEMBER";
    AutomationActionType["GENERATE_NOTIFICATION"] = "GENERATE_NOTIFICATION";
    AutomationActionType["UPDATE_STATUS"] = "UPDATE_STATUS";
    AutomationActionType["SCHEDULE_FOLLOW_UP"] = "SCHEDULE_FOLLOW_UP";
})(AutomationActionType || (exports.AutomationActionType = AutomationActionType = {}));
class AutomationActionDto {
    type;
    config;
    static _OPENAPI_METADATA_FACTORY() {
        return { type: { required: true, enum: require("./automation.dto").AutomationActionType }, config: { required: false, type: "object", additionalProperties: true } };
    }
}
exports.AutomationActionDto = AutomationActionDto;
__decorate([
    (0, swagger_1.ApiProperty)({ enum: AutomationActionType }),
    (0, class_validator_1.IsEnum)(AutomationActionType),
    __metadata("design:type", String)
], AutomationActionDto.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: { title: 'Follow up with client' } }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsObject)(),
    __metadata("design:type", Object)
], AutomationActionDto.prototype, "config", void 0);
class CreateAutomationRuleDto {
    name;
    trigger;
    enabled = true;
    actions;
    static _OPENAPI_METADATA_FACTORY() {
        return { name: { required: true, type: () => String }, trigger: { required: true, enum: require("./automation.dto").AutomationTrigger }, enabled: { required: false, type: () => Boolean, default: true }, actions: { required: true, type: () => [require("./automation.dto").AutomationActionDto] } };
    }
}
exports.CreateAutomationRuleDto = CreateAutomationRuleDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Notify admin when invoice is overdue' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateAutomationRuleDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: AutomationTrigger }),
    (0, class_validator_1.IsEnum)(AutomationTrigger),
    __metadata("design:type", String)
], CreateAutomationRuleDto.prototype, "trigger", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ default: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreateAutomationRuleDto.prototype, "enabled", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: [AutomationActionDto] }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => AutomationActionDto),
    __metadata("design:type", Array)
], CreateAutomationRuleDto.prototype, "actions", void 0);
class UpdateAutomationRuleDto extends CreateAutomationRuleDto {
    static _OPENAPI_METADATA_FACTORY() {
        return {};
    }
}
exports.UpdateAutomationRuleDto = UpdateAutomationRuleDto;
class ExecuteAutomationDto {
    trigger;
    payload;
    static _OPENAPI_METADATA_FACTORY() {
        return { trigger: { required: true, enum: require("./automation.dto").AutomationTrigger }, payload: { required: false, type: "object", additionalProperties: true } };
    }
}
exports.ExecuteAutomationDto = ExecuteAutomationDto;
__decorate([
    (0, swagger_1.ApiProperty)({ enum: AutomationTrigger }),
    (0, class_validator_1.IsEnum)(AutomationTrigger),
    __metadata("design:type", String)
], ExecuteAutomationDto.prototype, "trigger", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: { userId: 'uuid', projectId: 'uuid' } }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsObject)(),
    __metadata("design:type", Object)
], ExecuteAutomationDto.prototype, "payload", void 0);
//# sourceMappingURL=automation.dto.js.map