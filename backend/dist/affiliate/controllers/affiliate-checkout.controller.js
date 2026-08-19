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
exports.AffiliateCheckoutController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const current_user_decorator_1 = require("../../common/decorators/current-user.decorator");
const validate_employee_code_dto_1 = require("../dto/validate-employee-code.dto");
const affiliate_service_1 = require("../services/affiliate.service");
let AffiliateCheckoutController = class AffiliateCheckoutController {
    affiliateService;
    constructor(affiliateService) {
        this.affiliateService = affiliateService;
    }
    /**
     * UX-only pre-validation of an employee code.
     *
     * This endpoint is NOT the security boundary — /payments/create-order re-runs the
     * exact same validation server-side and refuses to create a gateway order for an
     * invalid code. A client that skips or fakes this call gains nothing.
     */
    async validate(dto, user) {
        const result = await this.affiliateService.validateEmployeeCode(dto.employeeCode, user?.sub);
        if (!result.valid || !result.affiliate) {
            return { valid: false, message: result.message ?? 'Invalid or inactive employee code' };
        }
        // Only the code and an abbreviated name are exposed — never the commission rate,
        // internal ids, email, or eligibility internals.
        return {
            valid: true,
            employee: { code: result.affiliate.affiliateCode, name: result.displayName },
        };
    }
};
exports.AffiliateCheckoutController = AffiliateCheckoutController;
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Validate an employee code before checkout',
        description: 'Returns whether the code is currently usable. Responses are deliberately generic so codes cannot be enumerated.' }),
    (0, common_1.Post)('validate'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Validation result' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [validate_employee_code_dto_1.ValidateEmployeeCodeDto, Object]),
    __metadata("design:returntype", Promise)
], AffiliateCheckoutController.prototype, "validate", null);
exports.AffiliateCheckoutController = AffiliateCheckoutController = __decorate([
    (0, swagger_1.ApiTags)('Affiliate Checkout'),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    (0, common_1.Controller)('checkout/affiliate'),
    __metadata("design:paramtypes", [affiliate_service_1.AffiliateService])
], AffiliateCheckoutController);
//# sourceMappingURL=affiliate-checkout.controller.js.map