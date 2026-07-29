import { Injectable, NestMiddleware } from '@nestjs/common';
import { createHmac, timingSafeEqual } from 'crypto';
import { NextFunction, Request, Response } from 'express';

const SAFE_METHODS = new Set(['GET', 'HEAD', 'OPTIONS']);

@Injectable()
export class CsrfMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction): void {
    if (process.env.CSRF_ENABLED !== 'true' || SAFE_METHODS.has(req.method)) {
      next();
      return;
    }

    const secret = process.env.CSRF_SECRET || process.env.JWT_SECRET;
    if (!secret) {
      res.status(500).json({ success: false, message: 'CSRF secret is not configured' });
      return;
    }

    const token = req.header('x-csrf-token');
    const sessionId = req.header('x-session-id') || req.header('x-request-id') || '';
    if (!token || !this.isValidToken(token, sessionId, secret)) {
      res.status(403).json({ success: false, message: 'Invalid CSRF token' });
      return;
    }

    next();
  }

  private isValidToken(token: string, sessionId: string, secret: string): boolean {
    const expected = createHmac('sha256', secret).update(sessionId).digest('hex');
    const tokenBuffer = Buffer.from(token);
    const expectedBuffer = Buffer.from(expected);
    return tokenBuffer.length === expectedBuffer.length && timingSafeEqual(tokenBuffer, expectedBuffer);
  }
}
