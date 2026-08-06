"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StringUtil = void 0;
const crypto = require("crypto");
class StringUtil {
    static slugify(text) {
        return text
            .toString()
            .toLowerCase()
            .trim()
            .replace(/\s+/g, '-')
            .replace(/[^\w\-]+/g, '')
            .replace(/\-\-+/g, '-');
    }
    static generateRandomToken(bytes = 32) {
        return crypto.randomBytes(bytes).toString('hex');
    }
    static generateOrderNumber(prefix = 'ORD') {
        const timestamp = Date.now().toString().slice(-6);
        const random = Math.floor(1000 + Math.random() * 9000);
        return `${prefix}-${timestamp}-${random}`;
    }
    static sanitizeHtml(text) {
        return text.replace(/</g, '&lt;').replace(/>/g, '&gt;');
    }
}
exports.StringUtil = StringUtil;
//# sourceMappingURL=string.util.js.map