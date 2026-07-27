"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Permissions = void 0;
const common_1 = require("@nestjs/common");
const app_constants_1 = require("../constants/app.constants");
const Permissions = (...permissions) => (0, common_1.SetMetadata)(app_constants_1.APP_CONSTANTS.PERMISSIONS_KEY, permissions);
exports.Permissions = Permissions;
//# sourceMappingURL=permissions.decorator.js.map