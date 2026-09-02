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
exports.ProjectsController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const projects_service_1 = require("./projects.service");
const create_project_dto_1 = require("./dto/create-project.dto");
const update_project_dto_1 = require("./dto/update-project.dto");
const client_1 = require("@prisma/client");
const permissions_decorator_1 = require("../common/decorators/permissions.decorator");
const current_user_decorator_1 = require("../common/decorators/current-user.decorator");
let ProjectsController = class ProjectsController {
    projectsService;
    constructor(projectsService) {
        this.projectsService = projectsService;
    }
    async findAll(user, clientId, status, managerId, page = 1, limit = 20) {
        return this.projectsService.findAllForRequester(user, clientId, status, managerId, page, limit);
    }
    async findOne(id, user) {
        return this.projectsService.findOneForRequester(id, user);
    }
    async recalculateProgress(id) {
        const progress = await this.projectsService.recalculateProgress(id);
        return { progress, message: `Project progress updated to ${progress}%` };
    }
    async create(dto, user) {
        return this.projectsService.create(dto, user?.sub);
    }
    async update(id, dto, user) {
        return this.projectsService.update(id, dto, user?.sub);
    }
    async remove(id, user) {
        return this.projectsService.softDelete(id, user?.sub);
    }
};
exports.ProjectsController = ProjectsController;
__decorate([
    (0, common_1.Get)(),
    (0, permissions_decorator_1.Permissions)('projects.read', 'projects.manage'),
    (0, swagger_1.ApiOperation)({ summary: 'List projects with optional filters and pagination (clients only ever see their own)' }),
    (0, swagger_1.ApiQuery)({ name: 'clientId', required: false }),
    (0, swagger_1.ApiQuery)({ name: 'status', enum: client_1.ProjectStatusEnum, required: false }),
    (0, swagger_1.ApiQuery)({ name: 'managerId', required: false }),
    (0, swagger_1.ApiQuery)({ name: 'page', required: false, type: Number }),
    (0, swagger_1.ApiQuery)({ name: 'limit', required: false, type: Number }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Paginated project list' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Query)('clientId')),
    __param(2, (0, common_1.Query)('status')),
    __param(3, (0, common_1.Query)('managerId')),
    __param(4, (0, common_1.Query)('page', new common_1.DefaultValuePipe(1), common_1.ParseIntPipe)),
    __param(5, (0, common_1.Query)('limit', new common_1.DefaultValuePipe(20), common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String, String, Object, Object]),
    __metadata("design:returntype", Promise)
], ProjectsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, permissions_decorator_1.Permissions)('projects.read', 'projects.manage'),
    (0, swagger_1.ApiOperation)({ summary: 'Get project details with milestones, tasks, deliverables, and timeline (clients only ever see their own)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Project detail returned' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ProjectsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(':id/recalculate-progress'),
    (0, permissions_decorator_1.Permissions)('projects.manage'),
    (0, swagger_1.ApiOperation)({ summary: 'Recalculate and update project completion percentage based on task statuses' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Progress recalculated and updated' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ProjectsController.prototype, "recalculateProgress", null);
__decorate([
    (0, common_1.Post)(),
    (0, permissions_decorator_1.Permissions)('projects.create', 'projects.manage'),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new project manually (or auto-created when order confirmed)' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Project created successfully' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_project_dto_1.CreateProjectDto, Object]),
    __metadata("design:returntype", Promise)
], ProjectsController.prototype, "create", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, permissions_decorator_1.Permissions)('projects.update', 'projects.manage'),
    (0, swagger_1.ApiOperation)({ summary: 'Update project details, status, priority, or manager' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Project updated' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_project_dto_1.UpdateProjectDto, Object]),
    __metadata("design:returntype", Promise)
], ProjectsController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, permissions_decorator_1.Permissions)('projects.delete', 'projects.manage'),
    (0, swagger_1.ApiOperation)({ summary: 'Soft-delete (archive) a project' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Project archived' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ProjectsController.prototype, "remove", null);
exports.ProjectsController = ProjectsController = __decorate([
    (0, swagger_1.ApiTags)('Projects & Workflow Management'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)('projects'),
    __metadata("design:paramtypes", [projects_service_1.ProjectsService])
], ProjectsController);
//# sourceMappingURL=projects.controller.js.map