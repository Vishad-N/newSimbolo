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
exports.MilestonesController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const milestones_service_1 = require("./milestones.service");
const milestone_dto_1 = require("./dto/milestone.dto");
const permissions_decorator_1 = require("../common/decorators/permissions.decorator");
let MilestonesController = class MilestonesController {
    milestonesService;
    constructor(milestonesService) {
        this.milestonesService = milestonesService;
    }
    async findAll(projectId) {
        return this.milestonesService.findAll(projectId);
    }
    async findOne(id) {
        return this.milestonesService.findOne(id);
    }
    async create(dto) {
        return this.milestonesService.create(dto);
    }
    async update(id, dto) {
        return this.milestonesService.update(id, dto);
    }
    async remove(id) {
        return this.milestonesService.remove(id);
    }
};
exports.MilestonesController = MilestonesController;
__decorate([
    (0, common_1.Get)('project/:projectId'),
    (0, permissions_decorator_1.Permissions)('projects.read', 'projects.manage'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all milestones for a project ordered by sortOrder' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Project milestones returned' }),
    __param(0, (0, common_1.Param)('projectId', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], MilestonesController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, permissions_decorator_1.Permissions)('projects.read', 'projects.manage'),
    (0, swagger_1.ApiOperation)({ summary: 'Get a single milestone with tasks and dependencies' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Milestone returned' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], MilestonesController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(),
    (0, permissions_decorator_1.Permissions)('milestones.manage', 'projects.manage'),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new project milestone' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Milestone created' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [milestone_dto_1.CreateMilestoneDto]),
    __metadata("design:returntype", Promise)
], MilestonesController.prototype, "create", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, permissions_decorator_1.Permissions)('milestones.manage', 'projects.manage'),
    (0, swagger_1.ApiOperation)({ summary: 'Update milestone status, dates, or order' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Milestone updated' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, milestone_dto_1.UpdateMilestoneDto]),
    __metadata("design:returntype", Promise)
], MilestonesController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, permissions_decorator_1.Permissions)('milestones.manage', 'projects.manage'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete a milestone' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Milestone deleted' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], MilestonesController.prototype, "remove", null);
exports.MilestonesController = MilestonesController = __decorate([
    (0, swagger_1.ApiTags)('Project Milestones'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)('milestones'),
    __metadata("design:paramtypes", [milestones_service_1.MilestonesService])
], MilestonesController);
//# sourceMappingURL=milestones.controller.js.map