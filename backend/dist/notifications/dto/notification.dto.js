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
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateNotificationPreferencesDto = void 0;
const openapi = require("@nestjs/swagger");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class UpdateNotificationPreferencesDto {
    emailOrderUpdates;
    emailMarketing;
    inAppProjectAlerts;
    smsUrgentAlerts;
    static _OPENAPI_METADATA_FACTORY() {
        return { emailOrderUpdates: { required: false, type: () => Boolean }, emailMarketing: { required: false, type: () => Boolean }, inAppProjectAlerts: { required: false, type: () => Boolean }, smsUrgentAlerts: { required: false, type: () => Boolean } };
    }
}
exports.UpdateNotificationPreferencesDto = UpdateNotificationPreferencesDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Receive email notifications for order updates', example: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], UpdateNotificationPreferencesDto.prototype, "emailOrderUpdates", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Receive marketing emails', example: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], UpdateNotificationPreferencesDto.prototype, "emailMarketing", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Receive in-app project alerts', example: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], UpdateNotificationPreferencesDto.prototype, "inAppProjectAlerts", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Receive SMS for urgent alerts', example: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], UpdateNotificationPreferencesDto.prototype, "smsUrgentAlerts", void 0);
//# sourceMappingURL=notification.dto.js.map