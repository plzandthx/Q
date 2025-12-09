/**
 * Prisma client singleton
 * Ensures only one instance of PrismaClient is created
 */

import { PrismaClient } from '@prisma/client';
import { config, isDevelopment } from '../config/index.js';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: isDevelopment
      ? ['query', 'error', 'warn']
      : ['error'],
    datasourceUrl: config.DATABASE_URL,
  });

if (isDevelopment) {
  globalForPrisma.prisma = prisma;
}

// Graceful shutdown
process.on('beforeExit', async () => {
  await prisma.$disconnect();
});

export default prisma;
