"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Roles = void 0;
const common_1 = require("@nestjs/common");
const app_constants_1 = require("../constants/app.constants");
const Roles = (...roles) => (0, common_1.SetMetadata)(app_constants_1.APP_CONSTANTS.ROLES_KEY, roles);
exports.Roles = Roles;
//# sourceMappingURL=roles.decorator.js.map