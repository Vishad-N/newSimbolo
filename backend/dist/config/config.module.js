"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConfigModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const app_config_1 = require("./app.config");
const database_config_1 = require("./database.config");
const auth_config_1 = require("./auth.config");
const storage_config_1 = require("./storage.config");
const email_config_1 = require("./email.config");
const razorpay_config_1 = require("./razorpay.config");
const redis_config_1 = require("./redis.config");
const observability_config_1 = require("./observability.config");
const cloudinary_config_1 = require("./cloudinary.config");
const env_validation_1 = require("./env.validation");
let ConfigModule = class ConfigModule {
};
exports.ConfigModule = ConfigModule;
exports.ConfigModule = ConfigModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
                cache: true,
                expandVariables: true,
                validate: env_validation_1.validate,
                load: [
                    app_config_1.default,
                    database_config_1.default,
                    auth_config_1.default,
                    storage_config_1.default,
                    email_config_1.default,
                    razorpay_config_1.default,
                    redis_config_1.default,
                    observability_config_1.default,
                    cloudinary_config_1.default,
                ],
            }),
        ],
        exports: [config_1.ConfigModule],
    })
], ConfigModule);
//# sourceMappingURL=config.module.js.map