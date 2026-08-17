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
exports.TeamController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const team_service_1 = require("./team.service");
const assign_team_member_dto_1 = require("./dto/assign-team-member.dto");
const permissions_decorator_1 = require("../common/decorators/permissions.decorator");
let TeamController = class TeamController {
    teamService;
    constructor(teamService) {
        this.teamService = teamService;
    }
    async getProjectTeam(projectId) {
        return this.teamService.getProjectTeam(projectId);
    }
    async assign(dto) {
        return this.teamService.assignMember(dto);
    }
    async remove(id) {
        return this.teamService.removeMember(id);
    }
};
exports.TeamController = TeamController;
__decorate([
    (0, common_1.Get)('project/:projectId'),
    (0, permissions_decorator_1.Permissions)('projects.read', 'projects.manage'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all team members assigned to a project' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Project team returned' }),
    __param(0, (0, common_1.Param)('projectId', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], TeamController.prototype, "getProjectTeam", null);
__decorate([
    (0, common_1.Post)('assign'),
    (0, permissions_decorator_1.Permissions)('team.assign', 'projects.manage'),
    (0, swagger_1.ApiOperation)({ summary: 'Assign an internal team member to a project with a role' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Team member assigned' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [assign_team_member_dto_1.AssignTeamMemberDto]),
    __metadata("design:returntype", Promise)
], TeamController.prototype, "assign", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, permissions_decorator_1.Permissions)('team.assign', 'projects.manage'),
    (0, swagger_1.ApiOperation)({ summary: 'Remove a team member from a project' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Team member removed' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], TeamController.prototype, "remove", null);
exports.TeamController = TeamController = __decorate([
    (0, swagger_1.ApiTags)('Project Team Management'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)('team'),
    __metadata("design:paramtypes", [team_service_1.TeamService])
], TeamController);
//# sourceMappingURL=team.controller.js.map