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
exports.OrdersController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const orders_service_1 = require("./orders.service");
const create_order_dto_1 = require("./dto/create-order.dto");
const update_order_dto_1 = require("./dto/update-order.dto");
const client_checkout_dto_1 = require("./dto/client-checkout.dto");
const client_1 = require("@prisma/client");
const permissions_decorator_1 = require("../common/decorators/permissions.decorator");
const current_user_decorator_1 = require("../common/decorators/current-user.decorator");
let OrdersController = class OrdersController {
    ordersService;
    constructor(ordersService) {
        this.ordersService = ordersService;
    }
    async findAll(clientId, status, page = 1, limit = 20) {
        return this.ordersService.findAll(clientId, status, page, limit);
    }
    async findOne(id) {
        return this.ordersService.findOne(id);
    }
    async create(dto, user) {
        return this.ordersService.create(dto, user?.sub);
    }
    async checkout(dto, user) {
        return this.ordersService.checkout(dto, user.sub);
    }
    async update(id, dto, user) {
        return this.ordersService.update(id, dto, user?.sub);
    }
    async remove(id, user) {
        return this.ordersService.softDelete(id, user?.sub);
    }
};
exports.OrdersController = OrdersController;
__decorate([
    (0, common_1.Get)(),
    (0, permissions_decorator_1.Permissions)('orders.view', 'orders.manage'),
    (0, swagger_1.ApiOperation)({ summary: 'List all orders with optional filters and pagination' }),
    (0, swagger_1.ApiQuery)({ name: 'clientId', required: false }),
    (0, swagger_1.ApiQuery)({ name: 'status', enum: client_1.OrderStatusEnum, required: false }),
    (0, swagger_1.ApiQuery)({ name: 'page', required: false, type: Number }),
    (0, swagger_1.ApiQuery)({ name: 'limit', required: false, type: Number }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Paginated order list' }),
    __param(0, (0, common_1.Query)('clientId')),
    __param(1, (0, common_1.Query)('status')),
    __param(2, (0, common_1.Query)('page', new common_1.DefaultValuePipe(1), common_1.ParseIntPipe)),
    __param(3, (0, common_1.Query)('limit', new common_1.DefaultValuePipe(20), common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object, Object]),
    __metadata("design:returntype", Promise)
], OrdersController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, permissions_decorator_1.Permissions)('orders.view', 'orders.manage'),
    (0, swagger_1.ApiOperation)({ summary: 'Get order details by ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Order returned' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], OrdersController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(),
    (0, permissions_decorator_1.Permissions)('orders.manage'),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new order for a client' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Order created successfully' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_order_dto_1.CreateOrderDto, Object]),
    __metadata("design:returntype", Promise)
], OrdersController.prototype, "create", null);
__decorate([
    (0, common_1.Post)('checkout'),
    (0, permissions_decorator_1.Permissions)('orders.create'),
    (0, swagger_1.ApiOperation)({ summary: 'Client initiates a checkout for a package' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Order and Razorpay gateway order created successfully' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [client_checkout_dto_1.ClientCheckoutDto, Object]),
    __metadata("design:returntype", Promise)
], OrdersController.prototype, "checkout", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, permissions_decorator_1.Permissions)('orders.manage'),
    (0, swagger_1.ApiOperation)({ summary: 'Update order status or details (CONFIRMED status triggers auto-project creation)' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Order updated. If status changed to CONFIRMED, a project is auto-created.',
    }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_order_dto_1.UpdateOrderDto, Object]),
    __metadata("design:returntype", Promise)
], OrdersController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, permissions_decorator_1.Permissions)('orders.manage'),
    (0, swagger_1.ApiOperation)({ summary: 'Cancel and soft-delete an order' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Order cancelled' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], OrdersController.prototype, "remove", null);
exports.OrdersController = OrdersController = __decorate([
    (0, swagger_1.ApiTags)('Orders & Billing'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)('orders'),
    __metadata("design:paramtypes", [orders_service_1.OrdersService])
], OrdersController);
//# sourceMappingURL=orders.controller.js.map