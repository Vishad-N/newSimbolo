"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaginationUtil = void 0;
const app_constants_1 = require("../constants/app.constants");
class PaginationUtil {
    static getPrismaParameters(query) {
        const page = query.page && query.page > 0 ? query.page : app_constants_1.APP_CONSTANTS.DEFAULT_PAGE;
        const limit = query.limit && query.limit > 0 ? Math.min(query.limit, app_constants_1.APP_CONSTANTS.MAX_LIMIT) : app_constants_1.APP_CONSTANTS.DEFAULT_LIMIT;
        const skip = (page - 1) * limit;
        return {
            skip,
            take: limit,
            page,
            limit,
        };
    }
    static createPaginatedResponse(items, totalItems, page, limit) {
        const totalPages = Math.ceil(totalItems / limit) || 1;
        const hasNextPage = page < totalPages;
        const hasPreviousPage = page > 1;
        const meta = {
            page,
            limit,
            totalItems,
            totalPages,
            hasNextPage,
            hasPreviousPage,
        };
        return {
            items,
            meta,
        };
    }
}
exports.PaginationUtil = PaginationUtil;
//# sourceMappingURL=pagination.util.js.map