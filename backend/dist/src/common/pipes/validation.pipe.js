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
exports.CustomValidationPipe = void 0;
const common_1 = require("@nestjs/common");
const custom_exceptions_1 = require("../exceptions/custom.exceptions");
const error_codes_constant_1 = require("../constants/error-codes.constant");
let CustomValidationPipe = class CustomValidationPipe extends common_1.ValidationPipe {
    constructor() {
        super({
            whitelist: true,
            forbidNonWhitelisted: true,
            transform: true,
            transformOptions: {
                enableImplicitConversion: true,
            },
            exceptionFactory: (errors) => {
                const messages = this.formatErrors(errors);
                return new custom_exceptions_1.BusinessException(messages.join('; '), error_codes_constant_1.ERROR_CODES.VALIDATION_ERROR, common_1.HttpStatus.BAD_REQUEST);
            },
        });
    }
    formatErrors(errors) {
        const result = [];
        for (const error of errors) {
            if (error.constraints) {
                result.push(...Object.values(error.constraints));
            }
            if (error.children && error.children.length > 0) {
                result.push(...this.formatErrors(error.children));
            }
        }
        return result;
    }
};
exports.CustomValidationPipe = CustomValidationPipe;
exports.CustomValidationPipe = CustomValidationPipe = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], CustomValidationPipe);
//# sourceMappingURL=validation.pipe.js.map