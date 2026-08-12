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
exports.InsightQueryDto = exports.InsightCategory = void 0;
const openapi = require("@nestjs/swagger");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
var InsightCategory;
(function (InsightCategory) {
    InsightCategory["REVENUE"] = "REVENUE";
    InsightCategory["CLIENT"] = "CLIENT";
    InsightCategory["PROJECT"] = "PROJECT";
    InsightCategory["TEAM"] = "TEAM";
    InsightCategory["PAYMENT"] = "PAYMENT";
    InsightCategory["CONTENT"] = "CONTENT";
    InsightCategory["SERVICE"] = "SERVICE";
})(InsightCategory || (exports.InsightCategory = InsightCategory = {}));
class InsightQueryDto {
    category;
    static _OPENAPI_METADATA_FACTORY() {
        return { category: { required: false, enum: require("./insight.dto").InsightCategory } };
    }
}
exports.InsightQueryDto = InsightQueryDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: InsightCategory }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(InsightCategory),
    __metadata("design:type", String)
], InsightQueryDto.prototype, "category", void 0);
//# sourceMappingURL=insight.dto.js.map