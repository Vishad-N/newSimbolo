import { NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
/**
 * Captures the raw request body as a Buffer and stores it on req.rawBody.
 * Required for Razorpay webhook signature (HMAC-SHA256) verification,
 * which needs the exact raw bytes before any JSON parsing occurs.
 *
 * Must be applied BEFORE json() body-parser on webhook routes.
 */
export declare class RawBodyMiddleware implements NestMiddleware {
    use(req: Request, res: Response, next: NextFunction): void;
}
