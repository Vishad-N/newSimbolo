"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebsiteTeamModule = void 0;
const common_1 = require("@nestjs/common");
const website_team_controller_1 = require("./website-team.controller");
const website_team_service_1 = require("./website-team.service");
let WebsiteTeamModule = class WebsiteTeamModule {
};
exports.WebsiteTeamModule = WebsiteTeamModule;
exports.WebsiteTeamModule = WebsiteTeamModule = __decorate([
    (0, common_1.Module)({
        controllers: [website_team_controller_1.WebsiteTeamController],
        providers: [website_team_service_1.WebsiteTeamService],
    })
], WebsiteTeamModule);
//# sourceMappingURL=website-team.module.js.map