"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseService = void 0;
const common_1 = require("@nestjs/common");
const custom_exceptions_1 = require("../../common/exceptions/custom.exceptions");
class BaseService {
    logger;
    constructor(contextName) {
        this.logger = new common_1.Logger(contextName);
    }
    checkEntityExists(entity, resourceName, identifier) {
        if (!entity) {
            this.logger.warn(`${resourceName} with identifier "${identifier || 'unknown'}" not found`);
            throw new custom_exceptions_1.ResourceNotFoundException(resourceName, identifier);
        }
        return entity;
    }
}
exports.BaseService = BaseService;
//# sourceMappingURL=base.service.js.map