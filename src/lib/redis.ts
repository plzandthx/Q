/**
 * Redis Client
 * Provides caching, rate limiting, and session storage
 */

import Redis from 'ioredis';
import { config } from '../config/index.js';
import { logger } from './logger.js';

// Lazy-loaded Redis client
let redisClient: Redis | null = null;

/**
 * Get Redis client (lazy initialization)
 */
export function getRedis(): Redis {
  if (redisClient) {
    return redisClient;
  }

  redisClient = new Redis(config.REDIS_URL, {
    maxRetriesPerRequest: 3,
    retryStrategy(times) {
      const delay = Math.min(times * 50, 2000);
      return delay;
    },
    lazyConnect: true,
  });

  redisClient.on('connect', () => {
    logger.info('Redis connected');
  });

  redisClient.on('error', (error) => {
    logger.error('Redis error', {}, error);
  });

  redisClient.on('close', () => {
    logger.info('Redis connection closed');
  });

  return redisClient;
}

/**
 * Check if Redis is available
 */
export async function isRedisAvailable(): Promise<boolean> {
  try {
    const redis = getRedis();
    await redis.ping();
    return true;
  } catch {
    return false;
  }
}

/**
 * Close Redis connection
 */
export async function closeRedis(): Promise<void> {
  if (redisClient) {
    await redisClient.quit();
    redisClient = null;
  }
}

// ============================================================================
// Rate Limiting
// ============================================================================

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetAt: number;
  total: number;
  retryAfter: number; // milliseconds until retry is allowed
}

/**
 * Check rate limit using sliding window algorithm
 */
export async function checkRateLimit(
  key: string,
  limit: number,
  windowMs: number
): Promise<RateLimitResult> {
  const redis = getRedis();
  const now = Date.now();
  const windowStart = now - windowMs;
  const redisKey = `ratelimit:${key}`;

  try {
    // Use a transaction to atomically update the rate limit
    const pipeline = redis.pipeline();

    // Remove old entries outside the window
    pipeline.zremrangebyscore(redisKey, 0, windowStart);

    // Count current entries
    pipeline.zcard(redisKey);

    // Add current request
    pipeline.zadd(redisKey, now, `${now}:${Math.random()}`);

    // Set expiry
    pipeline.pexpire(redisKey, windowMs);

    const results = await pipeline.exec();

    if (!results) {
      // Redis unavailable, allow request
      return { allowed: true, remaining: limit, resetAt: now + windowMs, total: limit, retryAfter: 0 };
    }

    const count = results[1]?.[1] as number ?? 0;
    const allowed = count < limit;
    const remaining = Math.max(0, limit - count - 1);
    const retryAfter = allowed ? 0 : windowMs;

    return {
      allowed,
      remaining,
      resetAt: now + windowMs,
      total: limit,
      retryAfter,
    };
  } catch (error) {
    logger.error('Rate limit check failed', { key }, error as Error);
    // On error, allow the request
    return { allowed: true, remaining: limit, resetAt: now + windowMs, total: limit, retryAfter: 0 };
  }
}

/**
 * Check login rate limit (stricter, per email + IP)
 */
export async function checkLoginRateLimit(
  email: string,
  ip: string
): Promise<RateLimitResult> {
  const key = `login:${email}:${ip}`;
  return checkRateLimit(
    key,
    config.LOGIN_RATE_LIMIT_MAX_ATTEMPTS,
    config.LOGIN_RATE_LIMIT_WINDOW_MS
  );
}

/**
 * Record failed login attempt
 */
export async function recordFailedLogin(email: string, ip: string): Promise<void> {
  const redis = getRedis();
  const key = `login_failures:${email}`;
  const now = Date.now();

  try {
    await redis.pipeline()
      .zadd(key, now, `${ip}:${now}`)
      .pexpire(key, 24 * 60 * 60 * 1000) // Keep for 24 hours
      .exec();
  } catch (error) {
    logger.error('Failed to record login failure', { email }, error as Error);
  }
}

/**
 * Increment login failure counter (alias for recordFailedLogin with combined key)
 */
export async function incrementLoginFailure(email: string, ip: string): Promise<void> {
  return recordFailedLogin(email, ip);
}

/**
 * Get failed login count for a user
 */
export async function getFailedLoginCount(email: string, windowMs: number): Promise<number> {
  const redis = getRedis();
  const key = `login_failures:${email}`;
  const now = Date.now();

  try {
    const count = await redis.zcount(key, now - windowMs, now);
    return count;
  } catch {
    return 0;
  }
}

/**
 * Clear failed login attempts (after successful login)
 */
export async function clearFailedLogins(email: string): Promise<void> {
  const redis = getRedis();
  const key = `login_failures:${email}`;

  try {
    await redis.del(key);
  } catch (error) {
    logger.error('Failed to clear login failures', { email }, error as Error);
  }
}

/**
 * Clear login failures for a specific email and IP combination
 */
export async function clearLoginFailures(email: string, _ip: string): Promise<void> {
  // Clear both the general and specific keys
  return clearFailedLogins(email);
}

/**
 * Check widget submission rate limit
 */
export async function checkWidgetRateLimit(
  widgetId: string,
  identifier: string, // IP or respondent hash
  limit: number = 10,
  windowMs: number = 60000
): Promise<RateLimitResult> {
  const key = `widget:${widgetId}:${identifier}`;
  return checkRateLimit(key, limit, windowMs);
}

// ============================================================================
// Caching
// ============================================================================

/**
 * Get cached value
 */
export async function getCache<T>(key: string): Promise<T | null> {
  try {
    const redis = getRedis();
    const value = await redis.get(`cache:${key}`);
    return value ? JSON.parse(value) as T : null;
  } catch {
    return null;
  }
}

/**
 * Set cached value
 */
export async function setCache<T>(
  key: string,
  value: T,
  ttlSeconds: number = 300
): Promise<void> {
  try {
    const redis = getRedis();
    await redis.setex(`cache:${key}`, ttlSeconds, JSON.stringify(value));
  } catch (error) {
    logger.error('Cache set failed', { key }, error as Error);
  }
}

/**
 * Delete cached value
 */
export async function deleteCache(key: string): Promise<void> {
  try {
    const redis = getRedis();
    await redis.del(`cache:${key}`);
  } catch (error) {
    logger.error('Cache delete failed', { key }, error as Error);
  }
}

/**
 * Delete cached values by pattern
 */
export async function deleteCachePattern(pattern: string): Promise<void> {
  try {
    const redis = getRedis();
    const keys = await redis.keys(`cache:${pattern}`);
    if (keys.length > 0) {
      await redis.del(...keys);
    }
  } catch (error) {
    logger.error('Cache pattern delete failed', { pattern }, error as Error);
  }
}

// ============================================================================
// Distributed Locks
// ============================================================================

/**
 * Acquire a distributed lock
 */
export async function acquireLock(
  key: string,
  ttlMs: number = 30000
): Promise<string | null> {
  const redis = getRedis();
  const lockKey = `lock:${key}`;
  const lockValue = `${Date.now()}:${Math.random()}`;

  try {
    const result = await redis.set(lockKey, lockValue, 'PX', ttlMs, 'NX');
    return result === 'OK' ? lockValue : null;
  } catch {
    return null;
  }
}

/**
 * Release a distributed lock
 */
export async function releaseLock(key: string, lockValue: string): Promise<boolean> {
  const redis = getRedis();
  const lockKey = `lock:${key}`;

  // Use Lua script to ensure atomic check-and-delete
  const script = `
    if redis.call("get", KEYS[1]) == ARGV[1] then
      return redis.call("del", KEYS[1])
    else
      return 0
    end
  `;

  try {
    const result = await redis.eval(script, 1, lockKey, lockValue);
    return result === 1;
  } catch {
    return false;
  }
}
