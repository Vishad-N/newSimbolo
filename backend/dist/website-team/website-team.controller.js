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
exports.WebsiteTeamController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const website_team_service_1 = require("./website-team.service");
const create_website_team_member_dto_1 = require("./dto/create-website-team-member.dto");
const update_website_team_member_dto_1 = require("./dto/update-website-team-member.dto");
const swagger_1 = require("@nestjs/swagger");
const permissions_decorator_1 = require("../common/decorators/permissions.decorator");
let WebsiteTeamController = class WebsiteTeamController {
    websiteTeamService;
    constructor(websiteTeamService) {
        this.websiteTeamService = websiteTeamService;
    }
    create(createDto) {
        return this.websiteTeamService.create(createDto);
    }
    findAll(activeOnly) {
        return this.websiteTeamService.findAll(activeOnly === 'true');
    }
    findOne(id) {
        return this.websiteTeamService.findOne(id);
    }
    reorder(updates) {
        return this.websiteTeamService.reorder(updates);
    }
    update(id, updateDto) {
        return this.websiteTeamService.update(id, updateDto);
    }
    remove(id) {
        return this.websiteTeamService.remove(id);
    }
};
exports.WebsiteTeamController = WebsiteTeamController;
__decorate([
    (0, common_1.Post)(),
    (0, permissions_decorator_1.Permissions)('content.create'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new website team member' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'The member has been successfully created.' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_website_team_member_dto_1.CreateWebsiteTeamMemberDto]),
    __metadata("design:returntype", void 0)
], WebsiteTeamController.prototype, "create", null);
__decorate([
    openapi.ApiQuery({ name: "activeOnly", required: false }),
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get all website team members' }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Query)('activeOnly')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], WebsiteTeamController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get a specific website team member by id' }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], WebsiteTeamController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)('reorder'),
    (0, permissions_decorator_1.Permissions)('content.update'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Reorder team members' }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array]),
    __metadata("design:returntype", void 0)
], WebsiteTeamController.prototype, "reorder", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, permissions_decorator_1.Permissions)('content.update'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Update a website team member' }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_website_team_member_dto_1.UpdateWebsiteTeamMemberDto]),
    __metadata("design:returntype", void 0)
], WebsiteTeamController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, permissions_decorator_1.Permissions)('content.delete'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Delete a website team member' }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], WebsiteTeamController.prototype, "remove", null);
exports.WebsiteTeamController = WebsiteTeamController = __decorate([
    (0, swagger_1.ApiTags)('Website Team'),
    (0, common_1.Controller)('website-team'),
    __metadata("design:paramtypes", [website_team_service_1.WebsiteTeamService])
], WebsiteTeamController);
//# sourceMappingURL=website-team.controller.js.map