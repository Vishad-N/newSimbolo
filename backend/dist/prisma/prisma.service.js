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
var PrismaService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrismaService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const client_1 = require("@prisma/client");
/**
 * Appends `connection_limit` (and a matching `pool_timeout`) to DATABASE_URL if
 * not already present. Without this, Prisma's query engine falls back to its own
 * default pool-sizing formula based on perceived CPU count, which is how a small
 * container ends up opening ~100 connections against Supabase's pooler — most of
 * which just sit idle and eat into the pooler's connection ceiling instead of
 * speeding anything up.
 */
function withConnectionLimit(url, poolSize) {
    try {
        const parsed = new URL(url);
        if (!parsed.searchParams.has('connection_limit')) {
            parsed.searchParams.set('connection_limit', String(poolSize));
        }
        if (!parsed.searchParams.has('pool_timeout')) {
            parsed.searchParams.set('pool_timeout', '10');
        }
        return parsed.toString();
    }
    catch {
        return url;
    }
}
let PrismaService = PrismaService_1 = class PrismaService extends client_1.PrismaClient {
    logger = new common_1.Logger(PrismaService_1.name);
    constructor(configService) {
        const url = configService.get('database.url', '');
        const poolSize = configService.get('database.poolSize', 20);
        super({
            datasources: url ? { db: { url: withConnectionLimit(url, poolSize) } } : undefined,
            log: [
                { emit: 'event', level: 'query' },
                { emit: 'stdout', level: 'info' },
                { emit: 'stdout', level: 'warn' },
                { emit: 'stdout', level: 'error' },
            ],
        });
    }
    async onModuleInit() {
        this.logger.log('Prisma Client will connect lazily on first database operation.');
    }
    async onModuleDestroy() {
        this.logger.log('Disconnecting Prisma Client...');
        await this.$disconnect();
        this.logger.log('Prisma Client disconnected gracefully.');
    }
};
exports.PrismaService = PrismaService;
exports.PrismaService = PrismaService = PrismaService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], PrismaService);
//# sourceMappingURL=prisma.service.js.map