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
exports.DeliverablesController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const deliverables_service_1 = require("./deliverables.service");
const deliverable_dto_1 = require("./dto/deliverable.dto");
const client_1 = require("@prisma/client");
const permissions_decorator_1 = require("../common/decorators/permissions.decorator");
const current_user_decorator_1 = require("../common/decorators/current-user.decorator");
let DeliverablesController = class DeliverablesController {
    deliverablesService;
    constructor(deliverablesService) {
        this.deliverablesService = deliverablesService;
    }
    async findAll(projectId, status) {
        return this.deliverablesService.findAll(projectId, status);
    }
    async findOne(id) {
        return this.deliverablesService.findOne(id);
    }
    async create(dto, user) {
        return this.deliverablesService.create(dto, user?.sub);
    }
    async update(id, dto, user) {
        return this.deliverablesService.update(id, dto, user?.sub);
    }
    async remove(id, user) {
        return this.deliverablesService.softDelete(id, user?.sub);
    }
};
exports.DeliverablesController = DeliverablesController;
__decorate([
    (0, common_1.Get)('project/:projectId'),
    (0, permissions_decorator_1.Permissions)('projects.read', 'deliverables.read'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all deliverables for a project' }),
    (0, swagger_1.ApiQuery)({ name: 'status', enum: client_1.DeliverableStatusEnum, required: false }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Deliverables returned' }),
    __param(0, (0, common_1.Param)('projectId', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Query)('status')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], DeliverablesController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, permissions_decorator_1.Permissions)('projects.read', 'deliverables.read'),
    (0, swagger_1.ApiOperation)({ summary: 'Get a single deliverable with version history' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Deliverable returned' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], DeliverablesController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(),
    (0, permissions_decorator_1.Permissions)('deliverables.upload', 'projects.manage'),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new deliverable for a project' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Deliverable created' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [deliverable_dto_1.CreateDeliverableDto, Object]),
    __metadata("design:returntype", Promise)
], DeliverablesController.prototype, "create", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, permissions_decorator_1.Permissions)('deliverables.upload', 'deliverables.approve', 'projects.manage'),
    (0, swagger_1.ApiOperation)({ summary: 'Update deliverable status, upload new version, or record client approval' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Deliverable updated. Status APPROVED or SUBMITTED triggers timeline event.',
    }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, deliverable_dto_1.UpdateDeliverableDto, Object]),
    __metadata("design:returntype", Promise)
], DeliverablesController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, permissions_decorator_1.Permissions)('projects.manage'),
    (0, swagger_1.ApiOperation)({ summary: 'Remove a deliverable' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Deliverable removed' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], DeliverablesController.prototype, "remove", null);
exports.DeliverablesController = DeliverablesController = __decorate([
    (0, swagger_1.ApiTags)('Project Deliverables & Client Approvals'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)('deliverables'),
    __metadata("design:paramtypes", [deliverables_service_1.DeliverablesService])
], DeliverablesController);
//# sourceMappingURL=deliverables.controller.js.map