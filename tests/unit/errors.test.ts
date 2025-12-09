/**
 * Error Handling Unit Tests
 */

import { describe, it, expect } from '@jest/globals';
import {
  AppError,
  ValidationError,
  UnauthorizedError,
  ForbiddenError,
  NotFoundError,
  ConflictError,
  RateLimitError,
  isAppError,
  formatErrorResponse,
} from '../../src/lib/errors.js';

describe('Error Classes', () => {
  describe('AppError', () => {
    it('should create an error with correct properties', () => {
      const error = new AppError('Test error', 500, 'TEST_ERROR', { key: 'value' });

      expect(error.message).toBe('Test error');
      expect(error.statusCode).toBe(500);
      expect(error.code).toBe('TEST_ERROR');
      expect(error.details).toEqual({ key: 'value' });
      expect(error.isOperational).toBe(true);
    });

    it('should use default values', () => {
      const error = new AppError('Test error');

      expect(error.statusCode).toBe(500);
      expect(error.code).toBe('INTERNAL_ERROR');
      expect(error.details).toBeUndefined();
    });
  });

  describe('ValidationError', () => {
    it('should have status code 400', () => {
      const error = new ValidationError('Invalid input');

      expect(error.statusCode).toBe(400);
      expect(error.code).toBe('VALIDATION_ERROR');
    });

    it('should include field details', () => {
      const error = new ValidationError('Invalid input', {
        fields: { email: ['Invalid email'] },
      });

      expect(error.details).toEqual({
        fields: { email: ['Invalid email'] },
      });
    });
  });

  describe('UnauthorizedError', () => {
    it('should have status code 401', () => {
      const error = new UnauthorizedError();

      expect(error.statusCode).toBe(401);
      expect(error.code).toBe('UNAUTHORIZED');
      expect(error.message).toBe('Authentication required');
    });

    it('should accept custom message', () => {
      const error = new UnauthorizedError('Token expired');

      expect(error.message).toBe('Token expired');
    });
  });

  describe('ForbiddenError', () => {
    it('should have status code 403', () => {
      const error = new ForbiddenError();

      expect(error.statusCode).toBe(403);
      expect(error.code).toBe('FORBIDDEN');
      expect(error.message).toBe('Access denied');
    });
  });

  describe('NotFoundError', () => {
    it('should have status code 404', () => {
      const error = new NotFoundError('User');

      expect(error.statusCode).toBe(404);
      expect(error.code).toBe('NOT_FOUND');
      expect(error.message).toBe('User not found');
    });

    it('should use default resource name', () => {
      const error = new NotFoundError();

      expect(error.message).toBe('Resource not found');
    });
  });

  describe('ConflictError', () => {
    it('should have status code 409', () => {
      const error = new ConflictError('Email already exists');

      expect(error.statusCode).toBe(409);
      expect(error.code).toBe('CONFLICT');
    });
  });

  describe('RateLimitError', () => {
    it('should have status code 429', () => {
      const error = new RateLimitError();

      expect(error.statusCode).toBe(429);
      expect(error.code).toBe('RATE_LIMIT_EXCEEDED');
    });
  });
});

describe('Error Utilities', () => {
  describe('isAppError', () => {
    it('should return true for AppError', () => {
      expect(isAppError(new AppError('test'))).toBe(true);
    });

    it('should return true for subclasses', () => {
      expect(isAppError(new ValidationError('test'))).toBe(true);
      expect(isAppError(new UnauthorizedError())).toBe(true);
      expect(isAppError(new NotFoundError())).toBe(true);
    });

    it('should return false for regular Error', () => {
      expect(isAppError(new Error('test'))).toBe(false);
    });

    it('should return false for non-errors', () => {
      expect(isAppError('string')).toBe(false);
      expect(isAppError(null)).toBe(false);
      expect(isAppError(undefined)).toBe(false);
    });
  });

  describe('formatErrorResponse', () => {
    it('should format error correctly', () => {
      const error = new ValidationError('Invalid email', {
        fields: { email: ['Required'] },
      });

      const response = formatErrorResponse(error);

      expect(response).toEqual({
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Invalid email',
          details: { fields: { email: ['Required'] } },
        },
      });
    });

    it('should omit details if not present', () => {
      const error = new NotFoundError('User');

      const response = formatErrorResponse(error);

      expect(response).toEqual({
        error: {
          code: 'NOT_FOUND',
          message: 'User not found',
        },
      });
    });
  });
});
