/**
 * Authentication Middleware
 * Handles JWT verification, session validation, and request context
 */

import { Request, Response, NextFunction } from 'express';
import { verifyToken, JwtPayload } from '../lib/jwt.js';
import { validateSession } from '../services/auth.service.js';
import { UnauthorizedError, ForbiddenError } from '../lib/errors.js';
import type { OrgRole, User } from '@prisma/client';
import * as orgService from '../services/organization.service.js';

// Extend Express Request type
declare global {
  namespace Express {
    interface Request {
      user?: User;
      userId?: string;
      sessionId?: string;
      organizationId?: string;
      organizationRole?: OrgRole;
      correlationId?: string;
    }
  }
}

/**
 * Extract token from request
 */
function extractToken(req: Request): string | null {
  // Check Authorization header
  const authHeader = req.headers.authorization;
  if (authHeader?.startsWith('Bearer ')) {
    return authHeader.substring(7);
  }

  // Check cookie
  const cookieToken = req.cookies?.access_token;
  if (cookieToken) {
    return cookieToken;
  }

  return null;
}

/**
 * Require authentication middleware
 */
export async function requireAuth(
  req: Request,
  _res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const token = extractToken(req);

    if (!token) {
      throw new UnauthorizedError('No authentication token provided');
    }

    // Verify JWT
    const payload = await verifyToken<JwtPayload>(token);

    // Validate session still exists and is valid
    const sessionData = await validateSession(payload.sessionId);

    if (!sessionData) {
      throw new UnauthorizedError('Session expired or invalid');
    }

    // Attach user to request
    req.user = sessionData.user;
    req.userId = sessionData.user.id;
    req.sessionId = payload.sessionId;

    next();
  } catch (error) {
    next(error);
  }
}

/**
 * Optional authentication - doesn't fail if no token
 */
export async function optionalAuth(
  req: Request,
  _res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const token = extractToken(req);

    if (token) {
      const payload = await verifyToken<JwtPayload>(token);
      const sessionData = await validateSession(payload.sessionId);

      if (sessionData) {
        req.user = sessionData.user;
        req.userId = sessionData.user.id;
        req.sessionId = payload.sessionId;
      }
    }

    next();
  } catch {
    // Ignore auth errors for optional auth
    next();
  }
}

/**
 * Require organization membership middleware
 * Must be used after requireAuth
 */
export function requireOrganization(minRole?: OrgRole) {
  return async (req: Request, _res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.userId) {
        throw new UnauthorizedError('Authentication required');
      }

      // Get organization ID from route params or header
      const orgId = req.params.orgId ?? req.headers['x-organization-id'] as string;

      if (!orgId) {
        throw new ForbiddenError('Organization context required');
      }

      // Check membership and role
      const role = await orgService.requireRole(orgId, req.userId, minRole);

      req.organizationId = orgId;
      req.organizationRole = role;

      next();
    } catch (error) {
      next(error);
    }
  };
}

/**
 * Require specific roles middleware factory
 */
export function requireRole(allowedRoles: OrgRole[]) {
  return async (req: Request, _res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.organizationRole) {
        throw new ForbiddenError('Organization context required');
      }

      if (!allowedRoles.includes(req.organizationRole)) {
        throw new ForbiddenError(
          `Requires one of these roles: ${allowedRoles.join(', ')}`
        );
      }

      next();
    } catch (error) {
      next(error);
    }
  };
}

/**
 * Rate limiting state (in production, use Redis)
 */
const rateLimitStore = new Map<string, { count: number; resetAt: number }>();

/**
 * Simple rate limiting middleware
 */
export function rateLimit(options: {
  windowMs: number;
  max: number;
  keyGenerator?: (req: Request) => string;
}) {
  const { windowMs, max, keyGenerator } = options;

  return (req: Request, res: Response, next: NextFunction): void => {
    const key = keyGenerator
      ? keyGenerator(req)
      : req.ip ?? req.headers['x-forwarded-for']?.toString() ?? 'unknown';

    const now = Date.now();
    const record = rateLimitStore.get(key);

    if (!record || record.resetAt < now) {
      rateLimitStore.set(key, { count: 1, resetAt: now + windowMs });
      next();
      return;
    }

    if (record.count >= max) {
      res.status(429).json({
        error: {
          code: 'RATE_LIMIT_EXCEEDED',
          message: 'Too many requests, please try again later',
        },
      });
      return;
    }

    record.count++;
    next();
  };
}

/**
 * Login rate limiting (stricter)
 */
export const loginRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 attempts per window
  keyGenerator: (req) => `login:${req.ip}:${req.body?.email ?? 'unknown'}`,
});

/**
 * API rate limiting (general)
 */
export const apiRateLimit = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 100, // 100 requests per minute
});

/**
 * Widget submission rate limiting
 */
export const widgetRateLimit = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 10, // 10 submissions per minute per IP
  keyGenerator: (req) => `widget:${req.ip}`,
});
