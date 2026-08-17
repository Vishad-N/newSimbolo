"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DateUtil = void 0;
class DateUtil {
    static nowIso() {
        return new Date().toISOString();
    }
    static addDays(days, fromDate = new Date()) {
        const result = new Date(fromDate);
        result.setDate(result.getDate() + days);
        return result;
    }
    static addMinutes(minutes, fromDate = new Date()) {
        const result = new Date(fromDate);
        result.setMinutes(result.getMinutes() + minutes);
        return result;
    }
    static isExpired(expirationDate) {
        return new Date() > new Date(expirationDate);
    }
}
exports.DateUtil = DateUtil;
//# sourceMappingURL=date.util.js.map