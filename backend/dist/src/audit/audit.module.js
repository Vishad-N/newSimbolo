"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BusinessAuditModule = void 0;
const common_1 = require("@nestjs/common");
const prisma_module_1 = require("../prisma/prisma.module");
const audit_query_service_1 = require("./audit-query.service");
const audit_controller_1 = require("./audit.controller");
let BusinessAuditModule = class BusinessAuditModule {
};
exports.BusinessAuditModule = BusinessAuditModule;
exports.BusinessAuditModule = BusinessAuditModule = __decorate([
    (0, common_1.Module)({
        imports: [prisma_module_1.PrismaModule],
        controllers: [audit_controller_1.AuditController],
        providers: [audit_query_service_1.AuditQueryService],
        exports: [audit_query_service_1.AuditQueryService],
    })
], BusinessAuditModule);
//# sourceMappingURL=audit.module.js.map