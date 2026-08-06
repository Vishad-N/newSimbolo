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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AutomationController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const permissions_decorator_1 = require("../common/decorators/permissions.decorator");
const automation_service_1 = require("./automation.service");
const automation_dto_1 = require("./dto/automation.dto");
let AutomationController = class AutomationController {
    automationService;
    constructor(automationService) {
        this.automationService = automationService;
    }
    create(dto) {
        return this.automationService.create(dto);
    }
    findAll() {
        return this.automationService.findAll();
    }
    update(id, dto) {
        return this.automationService.update(id, dto);
    }
    remove(id) {
        return this.automationService.remove(id);
    }
    execute(dto) {
        return this.automationService.execute(dto);
    }
};
exports.AutomationController = AutomationController;
__decorate([
    (0, common_1.Post)('rules'),
    (0, permissions_decorator_1.Permissions)('automation.manage'),
    (0, swagger_1.ApiOperation)({ summary: 'Create a configurable automation workflow rule' }),
    openapi.ApiResponse({ status: 201, type: Object }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [automation_dto_1.CreateAutomationRuleDto]),
    __metadata("design:returntype", void 0)
], AutomationController.prototype, "create", null);
__decorate([
    (0, common_1.Get)('rules'),
    (0, permissions_decorator_1.Permissions)('automation.manage'),
    (0, swagger_1.ApiOperation)({ summary: 'List automation workflow rules' }),
    openapi.ApiResponse({ status: 200 }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AutomationController.prototype, "findAll", null);
__decorate([
    (0, common_1.Patch)('rules/:id'),
    (0, permissions_decorator_1.Permissions)('automation.manage'),
    (0, swagger_1.ApiOperation)({ summary: 'Update an automation workflow rule' }),
    openapi.ApiResponse({ status: 200, type: Object }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, automation_dto_1.UpdateAutomationRuleDto]),
    __metadata("design:returntype", void 0)
], AutomationController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)('rules/:id'),
    (0, permissions_decorator_1.Permissions)('automation.manage'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete an automation workflow rule' }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AutomationController.prototype, "remove", null);
__decorate([
    (0, common_1.Post)('execute'),
    (0, permissions_decorator_1.Permissions)('automation.manage'),
    (0, swagger_1.ApiOperation)({ summary: 'Execute automation rules matching a workflow trigger' }),
    openapi.ApiResponse({ status: 201 }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [automation_dto_1.ExecuteAutomationDto]),
    __metadata("design:returntype", void 0)
], AutomationController.prototype, "execute", null);
exports.AutomationController = AutomationController = __decorate([
    (0, swagger_1.ApiTags)('Automation'),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    (0, common_1.Controller)('automation'),
    __metadata("design:paramtypes", [automation_service_1.AutomationService])
], AutomationController);
//# sourceMappingURL=automation.controller.js.map