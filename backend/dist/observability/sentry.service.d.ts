import { OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
export declare class SentryService implements OnModuleInit {
    private readonly configService;
    private initialized;
    constructor(configService: ConfigService);
    onModuleInit(): void;
    captureException(error: unknown): void;
    status(): "disabled" | "configured";
}
