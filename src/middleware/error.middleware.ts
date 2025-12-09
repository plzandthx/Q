/**
 * Error Handling Middleware
 * Centralized error handling with proper logging and responses
 */

import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { AppError, isAppError, formatErrorResponse, ValidationError } from '../lib/errors.js';
import { logger } from '../lib/logger.js';
import { isProduction } from '../config/index.js';

/**
 * Convert Zod errors to validation errors
 */
function formatZodError(error: ZodError): ValidationError {
  const details: Record<string, string[]> = {};

  for (const issue of error.issues) {
    const path = issue.path.join('.');
    if (!details[path]) {
      details[path] = [];
    }
    details[path].push(issue.message);
  }

  return new ValidationError('Validation failed', { fields: details });
}

/**
 * Not Found handler
 */
export function notFoundHandler(
  req: Request,
  res: Response,
  _next: NextFunction
): void {
  res.status(404).json({
    error: {
      code: 'NOT_FOUND',
      message: `Cannot ${req.method} ${req.path}`,
    },
  });
}

/**
 * Global error handler
 */
export function errorHandler(
  error: Error,
  req: Request,
  res: Response,
  _next: NextFunction
): void {
  // Generate correlation ID if not present
  const correlationId = req.correlationId ?? req.headers['x-correlation-id']?.toString();

  // Handle Zod validation errors
  if (error instanceof ZodError) {
    const validationError = formatZodError(error);
    logger.warn('Validation error', {
      correlationId,
      path: req.path,
      method: req.method,
      details: validationError.details,
    });

    res.status(validationError.statusCode).json(formatErrorResponse(validationError));
    return;
  }

  // Handle our custom AppErrors
  if (isAppError(error)) {
    // Log based on severity
    if (error.statusCode >= 500) {
      logger.error('Application error', {
        correlationId,
        path: req.path,
        method: req.method,
        code: error.code,
      }, error);
    } else {
      logger.warn('Client error', {
        correlationId,
        path: req.path,
        method: req.method,
        code: error.code,
        message: error.message,
      });
    }

    res.status(error.statusCode).json(formatErrorResponse(error));
    return;
  }

  // Handle unexpected errors
  logger.error('Unexpected error', {
    correlationId,
    path: req.path,
    method: req.method,
  }, error);

  // Don't expose internal error details in production
  const message = isProduction
    ? 'An unexpected error occurred'
    : error.message;

  res.status(500).json({
    error: {
      code: 'INTERNAL_ERROR',
      message,
      ...(correlationId && { correlationId }),
    },
  });
}

/**
 * Async handler wrapper
 * Catches async errors and passes them to the error handler
 */
export function asyncHandler<T>(
  fn: (req: Request, res: Response, next: NextFunction) => Promise<T>
) {
  return (req: Request, res: Response, next: NextFunction): void => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}
