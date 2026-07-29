"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RedisIoAdapter = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const platform_socket_io_1 = require("@nestjs/platform-socket.io");
const redis_adapter_1 = require("@socket.io/redis-adapter");
const ioredis_1 = require("ioredis");
class RedisIoAdapter extends platform_socket_io_1.IoAdapter {
    app;
    logger = new common_1.Logger('RedisIoAdapter');
    adapterConstructor;
    constructor(app) {
        super(app);
        this.app = app;
    }
    async connectToRedis() {
        const configService = this.app.get(config_1.ConfigService);
        const redisUrl = configService.get('redis.url');
        if (!redisUrl) {
            this.logger.warn('Socket.IO Redis adapter disabled because REDIS_URL is not configured');
            return;
        }
        const pubClient = new ioredis_1.default(redisUrl, { lazyConnect: true });
        const subClient = pubClient.duplicate();
        await Promise.all([pubClient.connect(), subClient.connect()]);
        this.adapterConstructor = (0, redis_adapter_1.createAdapter)(pubClient, subClient);
        this.logger.log('Socket.IO Redis adapter connected');
    }
    createIOServer(port, options) {
        const server = super.createIOServer(port, options);
        if (this.adapterConstructor)
            server.adapter(this.adapterConstructor);
        return server;
    }
}
exports.RedisIoAdapter = RedisIoAdapter;
//# sourceMappingURL=redis-io.adapter.js.map