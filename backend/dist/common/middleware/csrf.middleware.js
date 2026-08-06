"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CsrfMiddleware = void 0;
const common_1 = require("@nestjs/common");
const crypto_1 = require("crypto");
const SAFE_METHODS = new Set(['GET', 'HEAD', 'OPTIONS']);
let CsrfMiddleware = class CsrfMiddleware {
    use(req, res, next) {
        if (process.env.CSRF_ENABLED !== 'true' || SAFE_METHODS.has(req.method)) {
            next();
            return;
        }
        const secret = process.env.CSRF_SECRET || process.env.JWT_SECRET;
        if (!secret) {
            res.status(500).json({ success: false, message: 'CSRF secret is not configured' });
            return;
        }
        const token = req.header('x-csrf-token');
        const sessionId = req.header('x-session-id') || req.header('x-request-id') || '';
        if (!token || !this.isValidToken(token, sessionId, secret)) {
            res.status(403).json({ success: false, message: 'Invalid CSRF token' });
            return;
        }
        next();
    }
    isValidToken(token, sessionId, secret) {
        const expected = (0, crypto_1.createHmac)('sha256', secret).update(sessionId).digest('hex');
        const tokenBuffer = Buffer.from(token);
        const expectedBuffer = Buffer.from(expected);
        return tokenBuffer.length === expectedBuffer.length && (0, crypto_1.timingSafeEqual)(tokenBuffer, expectedBuffer);
    }
};
exports.CsrfMiddleware = CsrfMiddleware;
exports.CsrfMiddleware = CsrfMiddleware = __decorate([
    (0, common_1.Injectable)()
], CsrfMiddleware);
//# sourceMappingURL=csrf.middleware.js.map