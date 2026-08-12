"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SharedModule = void 0;
const common_1 = require("@nestjs/common");
const logger_module_1 = require("./logger/logger.module");
const audit_module_1 = require("./audit/audit.module");
const email_module_1 = require("./email/email.module");
const cloudinary_module_1 = require("./cloudinary/cloudinary.module");
let SharedModule = class SharedModule {
};
exports.SharedModule = SharedModule;
exports.SharedModule = SharedModule = __decorate([
    (0, common_1.Global)(),
    (0, common_1.Module)({
        imports: [logger_module_1.LoggerModule, audit_module_1.AuditModule, email_module_1.EmailModule, cloudinary_module_1.CloudinaryModule],
        exports: [logger_module_1.LoggerModule, audit_module_1.AuditModule, email_module_1.EmailModule, cloudinary_module_1.CloudinaryModule],
    })
], SharedModule);
//# sourceMappingURL=shared.module.js.map