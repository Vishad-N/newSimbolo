import { INestApplicationContext } from '@nestjs/common';
import { IoAdapter } from '@nestjs/platform-socket.io';
import { Server, ServerOptions } from 'socket.io';
export declare class RedisIoAdapter extends IoAdapter {
    private readonly app;
    private readonly logger;
    private adapterConstructor?;
    constructor(app: INestApplicationContext);
    connectToRedis(): Promise<void>;
    createIOServer(port: number, options?: ServerOptions): Server;
}
