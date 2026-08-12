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
exports.TasksController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const tasks_service_1 = require("./tasks.service");
const task_dto_1 = require("./dto/task.dto");
const client_1 = require("@prisma/client");
const permissions_decorator_1 = require("../common/decorators/permissions.decorator");
const current_user_decorator_1 = require("../common/decorators/current-user.decorator");
let TasksController = class TasksController {
    tasksService;
    constructor(tasksService) {
        this.tasksService = tasksService;
    }
    async findAll(projectId, status, assignedToId) {
        return this.tasksService.findAll(projectId, status, assignedToId);
    }
    async findOne(id) {
        return this.tasksService.findOne(id);
    }
    async create(dto, user) {
        return this.tasksService.create(dto, user?.sub);
    }
    async update(id, dto, user) {
        return this.tasksService.update(id, dto, user?.sub);
    }
    async addComment(id, dto, user) {
        return this.tasksService.addComment(id, dto, user?.sub);
    }
    async remove(id) {
        return this.tasksService.remove(id);
    }
};
exports.TasksController = TasksController;
__decorate([
    (0, common_1.Get)('project/:projectId'),
    (0, permissions_decorator_1.Permissions)('projects.read', 'projects.manage'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all tasks for a project (Kanban board data)' }),
    (0, swagger_1.ApiQuery)({ name: 'status', enum: client_1.TaskStatusEnum, required: false }),
    (0, swagger_1.ApiQuery)({ name: 'assignedToId', required: false }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Task list returned' }),
    __param(0, (0, common_1.Param)('projectId', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Query)('status')),
    __param(2, (0, common_1.Query)('assignedToId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], TasksController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, permissions_decorator_1.Permissions)('projects.read', 'projects.manage'),
    (0, swagger_1.ApiOperation)({ summary: 'Get a single task with comments and attachments' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Task returned' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], TasksController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(),
    (0, permissions_decorator_1.Permissions)('tasks.manage', 'projects.manage'),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new task within a project' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Task created' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [task_dto_1.CreateTaskDto, Object]),
    __metadata("design:returntype", Promise)
], TasksController.prototype, "create", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, permissions_decorator_1.Permissions)('tasks.manage', 'projects.manage'),
    (0, swagger_1.ApiOperation)({ summary: 'Update task status, assignee, priority, or hours' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Task updated' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, task_dto_1.UpdateTaskDto, Object]),
    __metadata("design:returntype", Promise)
], TasksController.prototype, "update", null);
__decorate([
    (0, common_1.Post)(':id/comments'),
    (0, permissions_decorator_1.Permissions)('tasks.manage', 'projects.read'),
    (0, swagger_1.ApiOperation)({ summary: 'Add a comment to a task' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Comment added' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, task_dto_1.AddTaskCommentDto, Object]),
    __metadata("design:returntype", Promise)
], TasksController.prototype, "addComment", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, permissions_decorator_1.Permissions)('tasks.manage', 'projects.manage'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete a task' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Task deleted' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], TasksController.prototype, "remove", null);
exports.TasksController = TasksController = __decorate([
    (0, swagger_1.ApiTags)('Project Tasks & Kanban'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)('tasks'),
    __metadata("design:paramtypes", [tasks_service_1.TasksService])
], TasksController);
//# sourceMappingURL=tasks.controller.js.map