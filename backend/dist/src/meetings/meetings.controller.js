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
exports.MeetingsController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const meetings_service_1 = require("./meetings.service");
const meeting_dto_1 = require("./dto/meeting.dto");
const permissions_decorator_1 = require("../common/decorators/permissions.decorator");
const current_user_decorator_1 = require("../common/decorators/current-user.decorator");
let MeetingsController = class MeetingsController {
    meetingsService;
    constructor(meetingsService) {
        this.meetingsService = meetingsService;
    }
    async findAll(clientId, hostId, upcoming = false, page = 1, limit = 20) {
        return this.meetingsService.findAll(clientId, hostId, upcoming, page, limit);
    }
    async findOne(id) {
        return this.meetingsService.findOne(id);
    }
    async create(dto, user) {
        return this.meetingsService.create(dto, user?.sub);
    }
    async update(id, dto, user) {
        return this.meetingsService.update(id, dto, user?.sub);
    }
    async remove(id, user) {
        return this.meetingsService.softDelete(id, user?.sub);
    }
};
exports.MeetingsController = MeetingsController;
__decorate([
    (0, common_1.Get)(),
    (0, permissions_decorator_1.Permissions)('meetings.read', 'meetings.manage'),
    (0, swagger_1.ApiOperation)({ summary: 'List meetings with optional filters' }),
    (0, swagger_1.ApiQuery)({ name: 'clientId', required: false }),
    (0, swagger_1.ApiQuery)({ name: 'hostId', required: false }),
    (0, swagger_1.ApiQuery)({ name: 'upcoming', required: false, type: Boolean }),
    (0, swagger_1.ApiQuery)({ name: 'page', required: false, type: Number }),
    (0, swagger_1.ApiQuery)({ name: 'limit', required: false, type: Number }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Paginated meetings list' }),
    __param(0, (0, common_1.Query)('clientId')),
    __param(1, (0, common_1.Query)('hostId')),
    __param(2, (0, common_1.Query)('upcoming', new common_1.DefaultValuePipe(false), common_1.ParseBoolPipe)),
    __param(3, (0, common_1.Query)('page', new common_1.DefaultValuePipe(1), common_1.ParseIntPipe)),
    __param(4, (0, common_1.Query)('limit', new common_1.DefaultValuePipe(20), common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object, Object, Object]),
    __metadata("design:returntype", Promise)
], MeetingsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, permissions_decorator_1.Permissions)('meetings.read', 'meetings.manage'),
    (0, swagger_1.ApiOperation)({ summary: 'Get meeting details with participants and agenda' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Meeting returned' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], MeetingsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(),
    (0, permissions_decorator_1.Permissions)('meetings.manage'),
    (0, swagger_1.ApiOperation)({ summary: 'Schedule a new meeting with participants' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Meeting scheduled' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [meeting_dto_1.CreateMeetingDto, Object]),
    __metadata("design:returntype", Promise)
], MeetingsController.prototype, "create", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, permissions_decorator_1.Permissions)('meetings.manage'),
    (0, swagger_1.ApiOperation)({ summary: 'Update meeting details, agenda, notes, or status' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Meeting updated' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, meeting_dto_1.UpdateMeetingDto, Object]),
    __metadata("design:returntype", Promise)
], MeetingsController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, permissions_decorator_1.Permissions)('meetings.manage'),
    (0, swagger_1.ApiOperation)({ summary: 'Cancel a meeting' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Meeting cancelled' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], MeetingsController.prototype, "remove", null);
exports.MeetingsController = MeetingsController = __decorate([
    (0, swagger_1.ApiTags)('Meetings & Scheduling'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)('meetings'),
    __metadata("design:paramtypes", [meetings_service_1.MeetingsService])
], MeetingsController);
//# sourceMappingURL=meetings.controller.js.map