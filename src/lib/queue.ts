/**
 * Background Job Queue
 * Simple Redis-based job queue for async processing
 */

import { getRedis, acquireLock, releaseLock } from './redis.js';
import { logger } from './logger.js';

export interface Job<T = unknown> {
  id: string;
  type: string;
  data: T;
  attempts: number;
  maxAttempts: number;
  createdAt: number;
  scheduledAt: number;
  lastError?: string;
}

export interface JobHandler<T = unknown> {
  (job: Job<T>): Promise<void>;
}

// Job handlers registry
const handlers = new Map<string, JobHandler>();

// Queue configuration
const QUEUE_PREFIX = 'queue:';
const PROCESSING_PREFIX = 'processing:';
const DEAD_LETTER_PREFIX = 'dead:';
const DEFAULT_MAX_ATTEMPTS = 3;
const PROCESSING_TIMEOUT = 30000; // 30 seconds
const POLL_INTERVAL = 1000; // 1 second

let isProcessing = false;
let processingInterval: NodeJS.Timeout | null = null;

/**
 * Register a job handler
 */
export function registerHandler<T>(type: string, handler: JobHandler<T>): void {
  handlers.set(type, handler as JobHandler);
  logger.info('Job handler registered', { type });
}

/**
 * Add a job to the queue
 */
export async function enqueue<T>(
  type: string,
  data: T,
  options: {
    delay?: number;
    maxAttempts?: number;
  } = {}
): Promise<string> {
  const redis = getRedis();
  const jobId = `${type}:${Date.now()}:${Math.random().toString(36).slice(2)}`;

  const job: Job<T> = {
    id: jobId,
    type,
    data,
    attempts: 0,
    maxAttempts: options.maxAttempts ?? DEFAULT_MAX_ATTEMPTS,
    createdAt: Date.now(),
    scheduledAt: Date.now() + (options.delay ?? 0),
  };

  const score = job.scheduledAt;
  await redis.zadd(`${QUEUE_PREFIX}jobs`, score, JSON.stringify(job));

  logger.debug('Job enqueued', { jobId, type });

  return jobId;
}

/**
 * Process a single job
 */
async function processJob(job: Job): Promise<void> {
  const handler = handlers.get(job.type);

  if (!handler) {
    logger.error('No handler for job type', { type: job.type, jobId: job.id });
    return;
  }

  const redis = getRedis();
  const lockKey = `job:${job.id}`;
  const lockValue = await acquireLock(lockKey, PROCESSING_TIMEOUT);

  if (!lockValue) {
    // Job is being processed by another worker
    return;
  }

  try {
    job.attempts++;

    logger.debug('Processing job', { jobId: job.id, type: job.type, attempt: job.attempts });

    await handler(job);

    // Job completed successfully
    await redis.zrem(`${QUEUE_PREFIX}jobs`, JSON.stringify(job));

    logger.info('Job completed', { jobId: job.id, type: job.type });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    job.lastError = errorMessage;

    logger.error('Job failed', {
      jobId: job.id,
      type: job.type,
      attempt: job.attempts,
      error: errorMessage,
    }, error as Error);

    // Remove from main queue
    await redis.zrem(`${QUEUE_PREFIX}jobs`, JSON.stringify(job));

    if (job.attempts >= job.maxAttempts) {
      // Move to dead letter queue
      await redis.zadd(
        `${DEAD_LETTER_PREFIX}jobs`,
        Date.now(),
        JSON.stringify(job)
      );
      logger.error('Job moved to dead letter queue', { jobId: job.id, type: job.type });
    } else {
      // Retry with exponential backoff
      const delay = Math.pow(2, job.attempts) * 1000; // 2s, 4s, 8s...
      job.scheduledAt = Date.now() + delay;
      await redis.zadd(`${QUEUE_PREFIX}jobs`, job.scheduledAt, JSON.stringify(job));
      logger.info('Job scheduled for retry', { jobId: job.id, delay });
    }
  } finally {
    await releaseLock(lockKey, lockValue);
  }
}

/**
 * Poll for jobs and process them
 */
async function pollJobs(): Promise<void> {
  if (!isProcessing) {
    return;
  }

  const redis = getRedis();
  const now = Date.now();

  try {
    // Get jobs that are ready to be processed
    const jobStrings = await redis.zrangebyscore(
      `${QUEUE_PREFIX}jobs`,
      0,
      now,
      'LIMIT',
      0,
      10 // Process up to 10 jobs at a time
    );

    for (const jobString of jobStrings) {
      try {
        const job = JSON.parse(jobString) as Job;
        await processJob(job);
      } catch (error) {
        logger.error('Failed to parse job', { jobString }, error as Error);
      }
    }
  } catch (error) {
    logger.error('Job polling error', {}, error as Error);
  }
}

/**
 * Start the job processor
 */
export function startProcessor(): void {
  if (isProcessing) {
    return;
  }

  isProcessing = true;
  processingInterval = setInterval(pollJobs, POLL_INTERVAL);

  logger.info('Job processor started');
}

/**
 * Stop the job processor
 */
export function stopProcessor(): void {
  isProcessing = false;

  if (processingInterval) {
    clearInterval(processingInterval);
    processingInterval = null;
  }

  logger.info('Job processor stopped');
}

/**
 * Get queue statistics
 */
export async function getQueueStats(): Promise<{
  pending: number;
  deadLetter: number;
}> {
  const redis = getRedis();

  const [pending, deadLetter] = await Promise.all([
    redis.zcard(`${QUEUE_PREFIX}jobs`),
    redis.zcard(`${DEAD_LETTER_PREFIX}jobs`),
  ]);

  return { pending, deadLetter };
}

/**
 * Retry a dead letter job
 */
export async function retryDeadLetterJob(jobId: string): Promise<boolean> {
  const redis = getRedis();

  // Find the job in dead letter queue
  const jobs = await redis.zrange(`${DEAD_LETTER_PREFIX}jobs`, 0, -1);

  for (const jobString of jobs) {
    try {
      const job = JSON.parse(jobString) as Job;
      if (job.id === jobId) {
        // Remove from dead letter
        await redis.zrem(`${DEAD_LETTER_PREFIX}jobs`, jobString);

        // Reset attempts and re-queue
        job.attempts = 0;
        job.scheduledAt = Date.now();
        delete job.lastError;

        await redis.zadd(`${QUEUE_PREFIX}jobs`, job.scheduledAt, JSON.stringify(job));

        logger.info('Dead letter job retried', { jobId });
        return true;
      }
    } catch {
      continue;
    }
  }

  return false;
}

/**
 * Clear dead letter queue
 */
export async function clearDeadLetterQueue(): Promise<number> {
  const redis = getRedis();
  const count = await redis.zcard(`${DEAD_LETTER_PREFIX}jobs`);
  await redis.del(`${DEAD_LETTER_PREFIX}jobs`);
  return count;
}

// ============================================================================
// Pre-defined Job Types
// ============================================================================

// Job types enum
export const JobTypes = {
  SEND_EMAIL: 'email:send',
  PROCESS_INBOUND_EVENT: 'integration:inbound',
  EXECUTE_OUTBOUND_ACTION: 'integration:outbound',
  COMPUTE_AGGREGATES: 'csat:aggregate',
  SYNC_INTEGRATION: 'integration:sync',
} as const;

export type JobType = typeof JobTypes[keyof typeof JobTypes];
