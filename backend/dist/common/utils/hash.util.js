"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HashUtil = void 0;
const bcrypt = require("bcrypt");
class HashUtil {
    static async hashPassword(password, rounds = 12) {
        return bcrypt.hash(password, rounds);
    }
    static async comparePassword(plainText, hashed) {
        return bcrypt.compare(plainText, hashed);
    }
}
exports.HashUtil = HashUtil;
//# sourceMappingURL=hash.util.js.map