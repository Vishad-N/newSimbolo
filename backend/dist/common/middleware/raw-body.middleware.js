"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RawBodyMiddleware = void 0;
const common_1 = require("@nestjs/common");
/**
 * Captures the raw request body as a Buffer and stores it on req.rawBody.
 * Required for Razorpay webhook signature (HMAC-SHA256) verification,
 * which needs the exact raw bytes before any JSON parsing occurs.
 *
 * Must be applied BEFORE json() body-parser on webhook routes.
 */
let RawBodyMiddleware = class RawBodyMiddleware {
    use(req, res, next) {
        const chunks = [];
        req.on('data', (chunk) => chunks.push(chunk));
        req.on('end', () => {
            req.rawBody = Buffer.concat(chunks);
            next();
        });
        req.on('error', next);
    }
};
exports.RawBodyMiddleware = RawBodyMiddleware;
exports.RawBodyMiddleware = RawBodyMiddleware = __decorate([
    (0, common_1.Injectable)()
], RawBodyMiddleware);
//# sourceMappingURL=raw-body.middleware.js.map