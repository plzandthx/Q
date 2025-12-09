/**
 * Q CSAT Dashboard - API Server Entry Point
 * Enterprise-ready multi-tenant CSAT platform
 */

import express from 'express';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import { config, isProduction } from './config/index.js';
import { prisma } from './lib/prisma.js';
import { logger } from './lib/logger.js';
import {
  correlationId,
  requestLogger,
  securityHeaders,
  corsConfig,
  healthCheck,
} from './middleware/common.middleware.js';
import { errorHandler, notFoundHandler } from './middleware/error.middleware.js';
import { apiRateLimit } from './middleware/auth.middleware.js';
import routes from './routes/index.js';

// Create Express app
const app = express();

// ============================================================================
// Global Middleware
// ============================================================================

// Security headers
app.use(helmet({
  contentSecurityPolicy: isProduction,
  crossOriginEmbedderPolicy: false,
}));
app.use(securityHeaders);

// CORS
const allowedOrigins = isProduction
  ? [config.APP_URL]
  : [config.APP_URL, 'http://localhost:3000', 'http://localhost:5173'];
app.use(corsConfig(allowedOrigins));

// Request parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// Request tracing
app.use(correlationId);
app.use(requestLogger);

// Rate limiting (skip for health check)
app.use('/api', apiRateLimit);

// ============================================================================
// Routes
// ============================================================================

// Health check
app.get('/health', healthCheck);

// API routes
app.use('/api', routes);

// ============================================================================
// Error Handling
// ============================================================================

// 404 handler
app.use(notFoundHandler);

// Global error handler
app.use(errorHandler);

// ============================================================================
// Server Startup
// ============================================================================

async function startServer(): Promise<void> {
  try {
    // Test database connection
    await prisma.$connect();
    logger.info('Database connected successfully');

    // Start server
    app.listen(config.PORT, () => {
      logger.info(`Server started`, {
        port: config.PORT,
        environment: config.NODE_ENV,
        apiUrl: config.API_URL,
      });
    });
  } catch (error) {
    logger.error('Failed to start server', {}, error as Error);
    process.exit(1);
  }
}

// Graceful shutdown
async function shutdown(signal: string): Promise<void> {
  logger.info(`Received ${signal}, shutting down gracefully...`);

  try {
    await prisma.$disconnect();
    logger.info('Database disconnected');
    process.exit(0);
  } catch (error) {
    logger.error('Error during shutdown', {}, error as Error);
    process.exit(1);
  }
}

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));

// Start the server
startServer();

export default app;
