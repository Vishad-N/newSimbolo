"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validate = validate;
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
var Environment;
(function (Environment) {
    Environment["Development"] = "development";
    Environment["Production"] = "production";
    Environment["Test"] = "test";
})(Environment || (Environment = {}));
class EnvironmentVariables {
    NODE_ENV;
    PORT;
    API_PORT;
    DATABASE_URL;
    DIRECT_URL;
    FRONTEND_URLS;
    JWT_SECRET;
    JWT_REFRESH_SECRET;
    GOOGLE_CLIENT_ID;
    GOOGLE_CLIENT_SECRET;
    GOOGLE_CALLBACK_URL;
    REDIS_URL;
    CLOUDINARY_CLOUD_NAME;
    CLOUDINARY_API_KEY;
    CLOUDINARY_API_SECRET;
    GEMINI_API_KEY;
    RAZORPAY_KEY_ID;
    RAZORPAY_KEY_SECRET;
    RAZORPAY_WEBHOOK_SECRET;
    SMTP_HOST;
    SMTP_PORT;
    SMTP_USER;
    SMTP_PASSWORD;
    SMTP_PASS;
    SMTP_FROM;
    GOOGLE_OAUTH_ENABLED;
    GEMINI_ENABLED;
    RAZORPAY_ENABLED;
    EMAIL_ENABLED;
    CLOUDINARY_ENABLED;
    STORAGE_PROVIDER;
    R2_ACCOUNT_ID;
    R2_ACCESS_KEY_ID;
    R2_SECRET_ACCESS_KEY;
    R2_BUCKET_NAME;
}
__decorate([
    (0, class_validator_1.IsEnum)(Environment),
    __metadata("design:type", String)
], EnvironmentVariables.prototype, "NODE_ENV", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], EnvironmentVariables.prototype, "PORT", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], EnvironmentVariables.prototype, "API_PORT", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], EnvironmentVariables.prototype, "DATABASE_URL", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], EnvironmentVariables.prototype, "DIRECT_URL", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], EnvironmentVariables.prototype, "FRONTEND_URLS", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], EnvironmentVariables.prototype, "JWT_SECRET", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], EnvironmentVariables.prototype, "JWT_REFRESH_SECRET", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], EnvironmentVariables.prototype, "GOOGLE_CLIENT_ID", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], EnvironmentVariables.prototype, "GOOGLE_CLIENT_SECRET", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUrl)({ require_tld: false }),
    __metadata("design:type", String)
], EnvironmentVariables.prototype, "GOOGLE_CALLBACK_URL", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], EnvironmentVariables.prototype, "REDIS_URL", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], EnvironmentVariables.prototype, "CLOUDINARY_CLOUD_NAME", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], EnvironmentVariables.prototype, "CLOUDINARY_API_KEY", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], EnvironmentVariables.prototype, "CLOUDINARY_API_SECRET", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], EnvironmentVariables.prototype, "GEMINI_API_KEY", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], EnvironmentVariables.prototype, "RAZORPAY_KEY_ID", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], EnvironmentVariables.prototype, "RAZORPAY_KEY_SECRET", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], EnvironmentVariables.prototype, "RAZORPAY_WEBHOOK_SECRET", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], EnvironmentVariables.prototype, "SMTP_HOST", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], EnvironmentVariables.prototype, "SMTP_PORT", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], EnvironmentVariables.prototype, "SMTP_USER", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], EnvironmentVariables.prototype, "SMTP_PASSWORD", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], EnvironmentVariables.prototype, "SMTP_PASS", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], EnvironmentVariables.prototype, "SMTP_FROM", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Transform)(({ value }) => parseOptionalBoolean(value)),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], EnvironmentVariables.prototype, "GOOGLE_OAUTH_ENABLED", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Transform)(({ value }) => parseOptionalBoolean(value)),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], EnvironmentVariables.prototype, "GEMINI_ENABLED", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Transform)(({ value }) => parseOptionalBoolean(value)),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], EnvironmentVariables.prototype, "RAZORPAY_ENABLED", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Transform)(({ value }) => parseOptionalBoolean(value)),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], EnvironmentVariables.prototype, "EMAIL_ENABLED", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Transform)(({ value }) => parseOptionalBoolean(value)),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], EnvironmentVariables.prototype, "CLOUDINARY_ENABLED", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], EnvironmentVariables.prototype, "STORAGE_PROVIDER", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], EnvironmentVariables.prototype, "R2_ACCOUNT_ID", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], EnvironmentVariables.prototype, "R2_ACCESS_KEY_ID", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], EnvironmentVariables.prototype, "R2_SECRET_ACCESS_KEY", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], EnvironmentVariables.prototype, "R2_BUCKET_NAME", void 0);
function validate(config) {
    const normalizedConfig = normalizeFeatureFlags(config);
    const validatedConfig = (0, class_transformer_1.plainToInstance)(EnvironmentVariables, normalizedConfig, {
        enableImplicitConversion: true,
    });
    const errors = (0, class_validator_1.validateSync)(validatedConfig, { skipMissingProperties: false });
    if (errors.length > 0) {
        throw new Error(`Environment validation failed: ${errors.toString()}`);
    }
    if (validatedConfig.NODE_ENV === Environment.Production) {
        validateProductionConfig(validatedConfig);
    }
    return validatedConfig;
}
function validateProductionConfig(config) {
    const missingVariables = [];
    requireValue(config.PORT, 'PORT', missingVariables);
    requireValue(config.DATABASE_URL, 'DATABASE_URL', missingVariables);
    requireValue(config.DIRECT_URL, 'DIRECT_URL', missingVariables);
    requireValue(config.REDIS_URL, 'REDIS_URL', missingVariables);
    requireValue(config.FRONTEND_URLS, 'FRONTEND_URLS', missingVariables);
    requireSecret(config.JWT_SECRET, 'JWT_SECRET', missingVariables);
    requireSecret(config.JWT_REFRESH_SECRET, 'JWT_REFRESH_SECRET', missingVariables);
    if (isIntegrationEnabled(config.GOOGLE_OAUTH_ENABLED, [
        config.GOOGLE_CLIENT_ID,
        config.GOOGLE_CLIENT_SECRET,
        config.GOOGLE_CALLBACK_URL,
    ])) {
        requireValue(config.GOOGLE_CLIENT_ID, 'GOOGLE_CLIENT_ID', missingVariables);
        requireSecret(config.GOOGLE_CLIENT_SECRET, 'GOOGLE_CLIENT_SECRET', missingVariables);
        requireValue(config.GOOGLE_CALLBACK_URL, 'GOOGLE_CALLBACK_URL', missingVariables);
    }
    if (isIntegrationEnabled(config.GEMINI_ENABLED, [config.GEMINI_API_KEY])) {
        requireSecret(config.GEMINI_API_KEY, 'GEMINI_API_KEY', missingVariables);
    }
    if (isIntegrationEnabled(config.RAZORPAY_ENABLED, [config.RAZORPAY_KEY_ID, config.RAZORPAY_KEY_SECRET])) {
        requireValue(config.RAZORPAY_KEY_ID, 'RAZORPAY_KEY_ID', missingVariables);
        requireSecret(config.RAZORPAY_KEY_SECRET, 'RAZORPAY_KEY_SECRET', missingVariables);
    }
    if (isIntegrationEnabled(config.EMAIL_ENABLED, [
        config.SMTP_HOST,
        config.SMTP_USER,
        config.SMTP_PASSWORD,
        config.SMTP_PASS,
    ])) {
        requireValue(config.SMTP_HOST, 'SMTP_HOST', missingVariables);
        requireValue(config.SMTP_PORT, 'SMTP_PORT', missingVariables);
        requireValue(config.SMTP_USER, 'SMTP_USER', missingVariables);
        requireCredential(config.SMTP_PASSWORD || config.SMTP_PASS, 'SMTP_PASSWORD', missingVariables);
    }
    if (isIntegrationEnabled(config.CLOUDINARY_ENABLED, [
        config.CLOUDINARY_CLOUD_NAME,
        config.CLOUDINARY_API_KEY,
        config.CLOUDINARY_API_SECRET,
    ])) {
        requireValue(config.CLOUDINARY_CLOUD_NAME, 'CLOUDINARY_CLOUD_NAME', missingVariables);
        requireValue(config.CLOUDINARY_API_KEY, 'CLOUDINARY_API_KEY', missingVariables);
        requireSecret(config.CLOUDINARY_API_SECRET, 'CLOUDINARY_API_SECRET', missingVariables);
    }
    if (config.STORAGE_PROVIDER === 'r2') {
        requireValue(config.R2_ACCOUNT_ID, 'R2_ACCOUNT_ID', missingVariables);
        requireValue(config.R2_ACCESS_KEY_ID, 'R2_ACCESS_KEY_ID', missingVariables);
        requireSecret(config.R2_SECRET_ACCESS_KEY, 'R2_SECRET_ACCESS_KEY', missingVariables);
        requireValue(config.R2_BUCKET_NAME, 'R2_BUCKET_NAME', missingVariables);
    }
    if (missingVariables.length > 0) {
        throw new Error(`Environment validation failed: ${missingVariables.join(', ')}`);
    }
}
function requireValue(value, name, missingVariables) {
    if (value === undefined || value === null || value === '') {
        missingVariables.push(`${name} is required in production`);
    }
}
function requireSecret(value, name, missingVariables) {
    requireValue(value, name, missingVariables);
    if (typeof value !== 'string')
        return;
    const normalized = value.toLowerCase();
    if (value.length < 16 ||
        normalized.includes('change-me') ||
        normalized.includes('mock') ||
        normalized.includes('your-')) {
        missingVariables.push(`${name} must be a non-placeholder secret with at least 16 characters`);
    }
}
function requireCredential(value, name, missingVariables) {
    requireValue(value, name, missingVariables);
    if (typeof value !== 'string')
        return;
    const normalized = value.toLowerCase();
    if (normalized.includes('change-me') || normalized.includes('mock') || normalized.includes('your-')) {
        missingVariables.push(`${name} must be a non-placeholder credential`);
    }
}
function parseOptionalBoolean(value) {
    if (value === undefined || value === null || value === '')
        return undefined;
    if (typeof value === 'boolean')
        return value;
    if (typeof value !== 'string')
        return Boolean(value);
    const normalized = value.trim().toLowerCase();
    if (['true', '1', 'yes', 'on'].includes(normalized))
        return true;
    if (['false', '0', 'no', 'off'].includes(normalized))
        return false;
    return Boolean(value);
}
function isIntegrationEnabled(flag, values) {
    if (flag !== undefined)
        return flag;
    return values.some((value) => typeof value === 'string' && value.trim().length > 0);
}
function normalizeFeatureFlags(config) {
    const normalized = { ...config };
    for (const key of [
        'GOOGLE_OAUTH_ENABLED',
        'GEMINI_ENABLED',
        'RAZORPAY_ENABLED',
        'EMAIL_ENABLED',
        'CLOUDINARY_ENABLED',
    ]) {
        normalized[key] = parseOptionalBoolean(normalized[key]);
    }
    return normalized;
}
//# sourceMappingURL=env.validation.js.map