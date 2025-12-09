/**
 * Common Middleware
 * Request processing, logging, and security headers
 */

import { Request, Response, NextFunction } from 'express';
import { randomBytes } from 'crypto';
import { logger } from '../lib/logger.js';

/**
 * Add correlation ID to requests
 */
export function correlationId(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const id = req.headers['x-correlation-id']?.toString() ?? randomBytes(8).toString('hex');
  req.correlationId = id;
  res.setHeader('X-Correlation-ID', id);
  next();
}

/**
 * Request logging middleware
 */
export function requestLogger(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const startTime = Date.now();

  // Log on response finish
  res.on('finish', () => {
    const duration = Date.now() - startTime;
    const logData = {
      correlationId: req.correlationId,
      method: req.method,
      path: req.path,
      statusCode: res.statusCode,
      duration,
      userId: req.userId,
      organizationId: req.organizationId,
    };

    if (res.statusCode >= 500) {
      logger.error('Request completed with error', logData);
    } else if (res.statusCode >= 400) {
      logger.warn('Request completed with client error', logData);
    } else {
      logger.info('Request completed', logData);
    }
  });

  next();
}

/**
 * Security headers middleware
 */
export function securityHeaders(
  _req: Request,
  res: Response,
  next: NextFunction
): void {
  // Prevent clickjacking
  res.setHeader('X-Frame-Options', 'DENY');

  // XSS protection
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-XSS-Protection', '1; mode=block');

  // HSTS (only in production)
  if (process.env.NODE_ENV === 'production') {
    res.setHeader(
      'Strict-Transport-Security',
      'max-age=31536000; includeSubDomains'
    );
  }

  // Content Security Policy
  res.setHeader(
    'Content-Security-Policy',
    "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:;"
  );

  // Referrer Policy
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');

  next();
}

/**
 * CORS configuration
 */
export function corsConfig(allowedOrigins: string[]) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const origin = req.headers.origin;

    if (origin && allowedOrigins.includes(origin)) {
      res.setHeader('Access-Control-Allow-Origin', origin);
    } else if (allowedOrigins.includes('*')) {
      res.setHeader('Access-Control-Allow-Origin', '*');
    }

    res.setHeader(
      'Access-Control-Allow-Methods',
      'GET, POST, PUT, PATCH, DELETE, OPTIONS'
    );
    res.setHeader(
      'Access-Control-Allow-Headers',
      'Content-Type, Authorization, X-Organization-ID, X-Correlation-ID'
    );
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Max-Age', '86400');

    // Handle preflight
    if (req.method === 'OPTIONS') {
      res.status(204).end();
      return;
    }

    next();
  };
}

/**
 * Request body size limiter
 */
export function bodySizeLimit(limit: string) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const contentLength = req.headers['content-length'];
    if (contentLength) {
      const bytes = parseInt(contentLength, 10);
      const limitBytes = parseSize(limit);

      if (bytes > limitBytes) {
        res.status(413).json({
          error: {
            code: 'PAYLOAD_TOO_LARGE',
            message: `Request body exceeds ${limit} limit`,
          },
        });
        return;
      }
    }
    next();
  };
}

function parseSize(size: string): number {
  const match = size.match(/^(\d+)(kb|mb|gb)?$/i);
  if (!match) {
    return 1024 * 1024; // Default 1MB
  }

  const value = parseInt(match[1], 10);
  const unit = (match[2] ?? 'b').toLowerCase();

  switch (unit) {
    case 'kb':
      return value * 1024;
    case 'mb':
      return value * 1024 * 1024;
    case 'gb':
      return value * 1024 * 1024 * 1024;
    default:
      return value;
  }
}

/**
 * Health check endpoint handler
 */
export function healthCheck(
  _req: Request,
  res: Response
): void {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    version: process.env.npm_package_version ?? '1.0.0',
  });
}
