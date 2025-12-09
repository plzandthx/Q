/**
 * JWT utilities using jose library
 * Handles token generation and verification
 */

import * as jose from 'jose';
import { config, jwtConfig } from '../config/index.js';
import { UnauthorizedError } from './errors.js';

export interface JwtPayload {
  sub: string; // User ID
  email: string;
  sessionId: string;
  iat?: number;
  exp?: number;
}

export interface RefreshPayload {
  sub: string;
  sessionId: string;
  type: 'refresh';
}

// Create a secret key from the config
function getSecretKey(): Uint8Array {
  return new TextEncoder().encode(jwtConfig.secret);
}

/**
 * Generate an access token
 */
export async function generateAccessToken(payload: Omit<JwtPayload, 'iat' | 'exp'>): Promise<string> {
  const secret = getSecretKey();

  return new jose.SignJWT(payload as jose.JWTPayload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(jwtConfig.expiresIn)
    .setIssuer('q-csat')
    .setAudience('q-csat-api')
    .sign(secret);
}

/**
 * Generate a refresh token (longer lived)
 */
export async function generateRefreshToken(payload: Omit<RefreshPayload, 'type'>): Promise<string> {
  const secret = getSecretKey();

  return new jose.SignJWT({ ...payload, type: 'refresh' } as jose.JWTPayload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('30d')
    .setIssuer('q-csat')
    .setAudience('q-csat-api')
    .sign(secret);
}

/**
 * Verify and decode a JWT
 */
export async function verifyToken<T extends jose.JWTPayload>(token: string): Promise<T> {
  try {
    const secret = getSecretKey();
    const { payload } = await jose.jwtVerify(token, secret, {
      issuer: 'q-csat',
      audience: 'q-csat-api',
    });
    return payload as T;
  } catch (error) {
    if (error instanceof jose.errors.JWTExpired) {
      throw new UnauthorizedError('Token has expired');
    }
    if (error instanceof jose.errors.JWTInvalid) {
      throw new UnauthorizedError('Invalid token');
    }
    throw new UnauthorizedError('Token verification failed');
  }
}

/**
 * Decode a token without verification (for debugging)
 */
export function decodeToken(token: string): jose.JWTPayload | null {
  try {
    return jose.decodeJwt(token);
  } catch {
    return null;
  }
}

/**
 * Parse duration string to milliseconds
 */
export function parseDuration(duration: string): number {
  const match = duration.match(/^(\d+)([smhd])$/);
  if (!match) {
    return 7 * 24 * 60 * 60 * 1000; // Default 7 days
  }

  const value = parseInt(match[1], 10);
  const unit = match[2];

  switch (unit) {
    case 's':
      return value * 1000;
    case 'm':
      return value * 60 * 1000;
    case 'h':
      return value * 60 * 60 * 1000;
    case 'd':
      return value * 24 * 60 * 60 * 1000;
    default:
      return 7 * 24 * 60 * 60 * 1000;
  }
}
