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
exports.RolesController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const roles_service_1 = require("./roles.service");
const create_role_dto_1 = require("./dto/create-role.dto");
const update_role_dto_1 = require("./dto/update-role.dto");
const permissions_decorator_1 = require("../common/decorators/permissions.decorator");
const current_user_decorator_1 = require("../common/decorators/current-user.decorator");
let RolesController = class RolesController {
    rolesService;
    constructor(rolesService) {
        this.rolesService = rolesService;
    }
    async findAll() {
        return this.rolesService.findAll();
    }
    async findOne(id) {
        return this.rolesService.findOne(id);
    }
    async create(dto, user) {
        return this.rolesService.create(dto, user.sub);
    }
    async update(id, dto, user) {
        return this.rolesService.update(id, dto, user.sub);
    }
    async remove(id, user) {
        return this.rolesService.remove(id, user.sub);
    }
    async assignPermissions(id, dto, user) {
        return this.rolesService.assignPermissions(id, dto, user.sub);
    }
};
exports.RolesController = RolesController;
__decorate([
    (0, common_1.Get)(),
    (0, permissions_decorator_1.Permissions)('roles.view'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all security roles and their assigned permission bundles' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'List of roles returned successfully.' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Insufficient permissions.' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], RolesController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, permissions_decorator_1.Permissions)('roles.view'),
    (0, swagger_1.ApiOperation)({ summary: 'Get a specific role by UUID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Role returned successfully.' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Role not found.' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], RolesController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(),
    (0, permissions_decorator_1.Permissions)('roles.manage'),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new custom role' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Role created successfully.' }),
    (0, swagger_1.ApiResponse)({ status: 409, description: 'Role name or slug already exists.' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_role_dto_1.CreateRoleDto, Object]),
    __metadata("design:returntype", Promise)
], RolesController.prototype, "create", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, permissions_decorator_1.Permissions)('roles.manage'),
    (0, swagger_1.ApiOperation)({ summary: 'Update an existing role' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Role updated successfully.' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Role not found.' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_role_dto_1.UpdateRoleDto, Object]),
    __metadata("design:returntype", Promise)
], RolesController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, permissions_decorator_1.Permissions)('roles.manage'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete a custom role' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Role deleted successfully.' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Cannot delete role with active users assigned.' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'System roles cannot be deleted.' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], RolesController.prototype, "remove", null);
__decorate([
    (0, common_1.Post)(':id/permissions'),
    (0, permissions_decorator_1.Permissions)('roles.manage', 'permissions.manage'),
    (0, swagger_1.ApiOperation)({ summary: 'Assign permission bundle to a role' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Permissions assigned successfully.' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_role_dto_1.AssignPermissionsDto, Object]),
    __metadata("design:returntype", Promise)
], RolesController.prototype, "assignPermissions", null);
exports.RolesController = RolesController = __decorate([
    (0, swagger_1.ApiTags)('Roles & Permissions Management'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)('roles'),
    __metadata("design:paramtypes", [roles_service_1.RolesService])
], RolesController);
//# sourceMappingURL=roles.controller.js.map