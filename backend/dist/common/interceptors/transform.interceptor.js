"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransformInterceptor = void 0;
const common_1 = require("@nestjs/common");
const operators_1 = require("rxjs/operators");
const client_1 = require("@prisma/client");
// Prisma.Decimal serializes to a string via toJSON(); convert it back to a
// plain number here so every API response keeps the pre-Decimal-migration
// numeric contract for frontend consumers.
function convertDecimals(value) {
    if (value instanceof client_1.Prisma.Decimal) {
        return value.toNumber();
    }
    if (Array.isArray(value)) {
        return value.map(convertDecimals);
    }
    if (value instanceof Date) {
        return value;
    }
    if (value && typeof value === 'object') {
        const result = {};
        for (const [key, val] of Object.entries(value)) {
            result[key] = convertDecimals(val);
        }
        return result;
    }
    return value;
}
let TransformInterceptor = class TransformInterceptor {
    intercept(context, next) {
        return next.handle().pipe((0, operators_1.map)((data) => {
            const converted = convertDecimals(data);
            // If data is already wrapped in standard envelope (e.g. paginated or manual wrapper), return as is or normalize
            if (converted && typeof converted === 'object' && 'success' in converted && 'message' in converted) {
                return converted;
            }
            return {
                success: true,
                message: 'Operation successful',
                data: converted !== undefined ? converted : null,
            };
        }));
    }
};
exports.TransformInterceptor = TransformInterceptor;
exports.TransformInterceptor = TransformInterceptor = __decorate([
    (0, common_1.Injectable)()
], TransformInterceptor);
//# sourceMappingURL=transform.interceptor.js.map