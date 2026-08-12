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
exports.PermissionsController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const permissions_service_1 = require("./permissions.service");
const permissions_decorator_1 = require("../common/decorators/permissions.decorator");
let PermissionsController = class PermissionsController {
    permissionsService;
    constructor(permissionsService) {
        this.permissionsService = permissionsService;
    }
    async findAll() {
        return this.permissionsService.findAll();
    }
    async findByModule(module) {
        return this.permissionsService.findByModule(module);
    }
    async findOne(id) {
        return this.permissionsService.findOne(id);
    }
};
exports.PermissionsController = PermissionsController;
__decorate([
    (0, common_1.Get)(),
    (0, permissions_decorator_1.Permissions)('permissions.view'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all system permissions' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'List of all permissions returned successfully.' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Insufficient permissions.' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], PermissionsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('module/:module'),
    (0, permissions_decorator_1.Permissions)('permissions.view'),
    (0, swagger_1.ApiOperation)({ summary: 'Get permissions filtered by module name' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Module permissions returned successfully.' }),
    __param(0, (0, common_1.Param)('module')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PermissionsController.prototype, "findByModule", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, permissions_decorator_1.Permissions)('permissions.view'),
    (0, swagger_1.ApiOperation)({ summary: 'Get permission details by UUID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Permission returned successfully.' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Permission not found.' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PermissionsController.prototype, "findOne", null);
exports.PermissionsController = PermissionsController = __decorate([
    (0, swagger_1.ApiTags)('Roles & Permissions Management'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)('permissions'),
    __metadata("design:paramtypes", [permissions_service_1.PermissionsService])
], PermissionsController);
//# sourceMappingURL=permissions.controller.js.map