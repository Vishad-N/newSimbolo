"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CmsModule = void 0;
const common_1 = require("@nestjs/common");
const cms_service_1 = require("./cms.service");
const homepage_controller_1 = require("./controllers/homepage.controller");
const about_us_controller_1 = require("./controllers/about-us.controller");
const help_center_controller_1 = require("./controllers/help-center.controller");
const navigation_controller_1 = require("./controllers/navigation.controller");
const footer_controller_1 = require("./controllers/footer.controller");
const prisma_module_1 = require("../prisma/prisma.module");
let CmsModule = class CmsModule {
};
exports.CmsModule = CmsModule;
exports.CmsModule = CmsModule = __decorate([
    (0, common_1.Module)({
        imports: [prisma_module_1.PrismaModule],
        controllers: [homepage_controller_1.HomepageController, about_us_controller_1.AboutUsController, help_center_controller_1.HelpCenterController, navigation_controller_1.NavigationController, footer_controller_1.FooterController],
        providers: [cms_service_1.CmsService],
        exports: [cms_service_1.CmsService],
    })
], CmsModule);
//# sourceMappingURL=cms.module.js.map