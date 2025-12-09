/**
 * Structured logging utility
 * Outputs JSON logs with correlation IDs and log levels
 */

import { config } from '../config/index.js';

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogContext {
  correlationId?: string;
  userId?: string;
  organizationId?: string;
  [key: string]: unknown;
}

interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  context?: LogContext;
  error?: {
    name: string;
    message: string;
    stack?: string;
  };
}

const LOG_LEVELS: Record<LogLevel, number> = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
};

const currentLevel = LOG_LEVELS[config.LOG_LEVEL];

function shouldLog(level: LogLevel): boolean {
  return LOG_LEVELS[level] >= currentLevel;
}

function formatLogEntry(entry: LogEntry): string {
  return JSON.stringify(entry);
}

function createLogger() {
  const log = (level: LogLevel, message: string, context?: LogContext, error?: Error): void => {
    if (!shouldLog(level)) {
      return;
    }

    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level,
      message,
      context,
    };

    if (error) {
      entry.error = {
        name: error.name,
        message: error.message,
        stack: error.stack,
      };
    }

    const output = formatLogEntry(entry);

    switch (level) {
      case 'debug':
      case 'info':
        // Using process.stdout for structured output
        process.stdout.write(output + '\n');
        break;
      case 'warn':
        console.warn(output);
        break;
      case 'error':
        console.error(output);
        break;
    }
  };

  return {
    debug: (message: string, context?: LogContext): void => log('debug', message, context),
    info: (message: string, context?: LogContext): void => log('info', message, context),
    warn: (message: string, context?: LogContext): void => log('warn', message, context),
    error: (message: string, context?: LogContext, error?: Error): void => log('error', message, context, error),

    // Create a child logger with bound context
    child: (boundContext: LogContext) => ({
      debug: (message: string, context?: LogContext): void =>
        log('debug', message, { ...boundContext, ...context }),
      info: (message: string, context?: LogContext): void =>
        log('info', message, { ...boundContext, ...context }),
      warn: (message: string, context?: LogContext): void =>
        log('warn', message, { ...boundContext, ...context }),
      error: (message: string, context?: LogContext, error?: Error): void =>
        log('error', message, { ...boundContext, ...context }, error),
    }),
  };
}

export const logger = createLogger();
export type Logger = ReturnType<typeof createLogger>;
