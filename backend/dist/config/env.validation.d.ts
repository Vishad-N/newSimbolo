declare enum Environment {
    Development = "development",
    Production = "production",
    Test = "test"
}
declare class EnvironmentVariables {
    NODE_ENV: Environment;
    API_PORT?: number;
    DATABASE_URL: string;
    FRONTEND_URLS: string;
    JWT_SECRET: string;
    JWT_REFRESH_SECRET: string;
    GOOGLE_CLIENT_ID?: string;
    GOOGLE_CLIENT_SECRET?: string;
    GOOGLE_CALLBACK_URL?: string;
    REDIS_URL?: string;
}
export declare function validate(config: Record<string, unknown>): EnvironmentVariables;
export {};
