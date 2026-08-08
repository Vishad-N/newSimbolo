"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const env_validation_1 = require("./env.validation");
(0, env_validation_1.validate)({
    ...process.env,
    NODE_ENV: 'production',
});
console.log('Production environment validation passed.');
//# sourceMappingURL=validate-production-env.js.map