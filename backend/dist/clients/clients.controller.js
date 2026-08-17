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
exports.ClientsController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const clients_service_1 = require("./clients.service");
const create_client_dto_1 = require("./dto/create-client.dto");
const update_client_dto_1 = require("./dto/update-client.dto");
const create_client_with_plan_dto_1 = require("./dto/create-client-with-plan.dto");
const permissions_decorator_1 = require("../common/decorators/permissions.decorator");
const current_user_decorator_1 = require("../common/decorators/current-user.decorator");
let ClientsController = class ClientsController {
    clientsService;
    constructor(clientsService) {
        this.clientsService = clientsService;
    }
    async findAll(search, status, companyId, accountManagerId, page = 1, limit = 20) {
        return this.clientsService.findAll(search, status, companyId, accountManagerId, page, limit);
    }
    async findOne(id) {
        return this.clientsService.findOne(id);
    }
    async findByUserId(userId) {
        return this.clientsService.findByUserId(userId);
    }
    async getTimeline(id, page = 1, limit = 30) {
        return this.clientsService.getClientTimeline(id, page, limit);
    }
    async getDashboard(id) {
        return this.clientsService.getClientDashboard(id);
    }
    async create(dto, user) {
        return this.clientsService.create(dto, user?.sub);
    }
    async createManualClient(dto, user) {
        return this.clientsService.createWithUserAndPlan(dto, user?.sub);
    }
    async update(id, dto, user) {
        return this.clientsService.update(id, dto, user?.sub);
    }
    async remove(id, user) {
        return this.clientsService.softDelete(id, user?.sub);
    }
};
exports.ClientsController = ClientsController;
__decorate([
    (0, common_1.Get)(),
    (0, permissions_decorator_1.Permissions)('clients.read', 'clients.manage'),
    (0, swagger_1.ApiOperation)({ summary: 'List all client profiles with optional filters and pagination' }),
    (0, swagger_1.ApiQuery)({ name: 'search', required: false, description: 'Search by name or email' }),
    (0, swagger_1.ApiQuery)({ name: 'status', required: false, description: 'Filter by client status' }),
    (0, swagger_1.ApiQuery)({ name: 'companyId', required: false }),
    (0, swagger_1.ApiQuery)({ name: 'accountManagerId', required: false }),
    (0, swagger_1.ApiQuery)({ name: 'page', required: false, type: Number }),
    (0, swagger_1.ApiQuery)({ name: 'limit', required: false, type: Number }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Paginated list of client profiles' }),
    __param(0, (0, common_1.Query)('search')),
    __param(1, (0, common_1.Query)('status')),
    __param(2, (0, common_1.Query)('companyId')),
    __param(3, (0, common_1.Query)('accountManagerId')),
    __param(4, (0, common_1.Query)('page', new common_1.DefaultValuePipe(1), common_1.ParseIntPipe)),
    __param(5, (0, common_1.Query)('limit', new common_1.DefaultValuePipe(20), common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String, Object, Object]),
    __metadata("design:returntype", Promise)
], ClientsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, permissions_decorator_1.Permissions)('clients.read', 'clients.manage'),
    (0, swagger_1.ApiOperation)({ summary: 'Get a single client profile by ID with full detail' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Client profile returned' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Client not found' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ClientsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Get)('user/:userId'),
    (0, permissions_decorator_1.Permissions)('clients.read', 'clients.manage'),
    (0, swagger_1.ApiOperation)({ summary: 'Get client profile by User ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Client profile returned' }),
    __param(0, (0, common_1.Param)('userId', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ClientsController.prototype, "findByUserId", null);
__decorate([
    (0, common_1.Get)(':id/timeline'),
    (0, permissions_decorator_1.Permissions)('clients.read', 'clients.manage'),
    (0, swagger_1.ApiOperation)({ summary: 'Get chronological activity timeline for a client' }),
    (0, swagger_1.ApiQuery)({ name: 'page', required: false, type: Number }),
    (0, swagger_1.ApiQuery)({ name: 'limit', required: false, type: Number }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Activity timeline returned' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Query)('page', new common_1.DefaultValuePipe(1), common_1.ParseIntPipe)),
    __param(2, (0, common_1.Query)('limit', new common_1.DefaultValuePipe(30), common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], ClientsController.prototype, "getTimeline", null);
__decorate([
    (0, common_1.Get)(':id/dashboard'),
    (0, permissions_decorator_1.Permissions)('clients.read', 'clients.manage'),
    (0, swagger_1.ApiOperation)({ summary: 'Get admin dashboard summary for a specific client' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Client dashboard summary returned' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ClientsController.prototype, "getDashboard", null);
__decorate([
    (0, common_1.Post)(),
    (0, permissions_decorator_1.Permissions)('clients.manage'),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new client profile' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Client profile created successfully' }),
    (0, swagger_1.ApiResponse)({ status: 409, description: 'Client profile already exists for this user' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_client_dto_1.CreateClientDto, Object]),
    __metadata("design:returntype", Promise)
], ClientsController.prototype, "create", null);
__decorate([
    (0, common_1.Post)('manual'),
    (0, permissions_decorator_1.Permissions)('clients.manage'),
    (0, swagger_1.ApiOperation)({ summary: 'Create a client user, client profile, and optional plan subscription manually' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Client user created successfully' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_client_with_plan_dto_1.CreateClientWithPlanDto, Object]),
    __metadata("design:returntype", Promise)
], ClientsController.prototype, "createManualClient", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, permissions_decorator_1.Permissions)('clients.manage'),
    (0, swagger_1.ApiOperation)({ summary: 'Update an existing client profile' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Client profile updated successfully' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_client_dto_1.UpdateClientDto, Object]),
    __metadata("design:returntype", Promise)
], ClientsController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, permissions_decorator_1.Permissions)('clients.manage'),
    (0, swagger_1.ApiOperation)({ summary: 'Soft-delete (deactivate) a client profile' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Client profile deactivated' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ClientsController.prototype, "remove", null);
exports.ClientsController = ClientsController = __decorate([
    (0, swagger_1.ApiTags)('Clients & Client Profiles'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)('clients'),
    __metadata("design:paramtypes", [clients_service_1.ClientsService])
], ClientsController);
//# sourceMappingURL=clients.controller.js.map