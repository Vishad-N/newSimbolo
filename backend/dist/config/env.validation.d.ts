declare enum Environment {
    Development = "development",
    Production = "production",
    Test = "test"
}
declare class EnvironmentVariables {
    NODE_ENV: Environment;
    PORT?: number;
    API_PORT?: number;
    DATABASE_URL: string;
    DIRECT_URL?: string;
    FRONTEND_URLS: string;
    JWT_SECRET: string;
    JWT_REFRESH_SECRET: string;
    GOOGLE_CLIENT_ID?: string;
    GOOGLE_CLIENT_SECRET?: string;
    GOOGLE_CALLBACK_URL?: string;
    REDIS_URL?: string;
    CLOUDINARY_CLOUD_NAME?: string;
    CLOUDINARY_API_KEY?: string;
    CLOUDINARY_API_SECRET?: string;
    GEMINI_API_KEY?: string;
    RAZORPAY_KEY_ID?: string;
    RAZORPAY_KEY_SECRET?: string;
    RAZORPAY_WEBHOOK_SECRET?: string;
    SMTP_HOST?: string;
    SMTP_PORT?: number;
    SMTP_USER?: string;
    SMTP_PASSWORD?: string;
    SMTP_PASS?: string;
    SMTP_FROM?: string;
    GOOGLE_OAUTH_ENABLED?: boolean;
    GEMINI_ENABLED?: boolean;
    RAZORPAY_ENABLED?: boolean;
    EMAIL_ENABLED?: boolean;
    CLOUDINARY_ENABLED?: boolean;
    STORAGE_PROVIDER?: string;
    R2_ACCOUNT_ID?: string;
    R2_ACCESS_KEY_ID?: string;
    R2_SECRET_ACCESS_KEY?: string;
    R2_BUCKET_NAME?: string;
}
export declare function validate(config: Record<string, unknown>): EnvironmentVariables;
export {};
