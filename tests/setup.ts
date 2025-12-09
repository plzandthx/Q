/**
 * Test Setup
 * Configuration and utilities for testing
 */

import { PrismaClient } from '@prisma/client';

// Mock Prisma client for unit tests
export const prismaMock = {
  user: {
    findUnique: jest.fn(),
    findFirst: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
  organization: {
    findUnique: jest.fn(),
    findFirst: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
  },
  orgMembership: {
    findUnique: jest.fn(),
    findFirst: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    count: jest.fn(),
  },
  session: {
    findUnique: jest.fn(),
    create: jest.fn(),
    delete: jest.fn(),
    deleteMany: jest.fn(),
  },
  project: {
    findUnique: jest.fn(),
    findFirst: jest.fn(),
    findMany: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    count: jest.fn(),
  },
  persona: {
    findUnique: jest.fn(),
    findFirst: jest.fn(),
    findMany: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
  },
  moment: {
    findUnique: jest.fn(),
    findFirst: jest.fn(),
    findMany: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
  },
  csatWidget: {
    findUnique: jest.fn(),
    findFirst: jest.fn(),
    findMany: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
  },
  csatResponse: {
    findFirst: jest.fn(),
    findMany: jest.fn(),
    create: jest.fn(),
    count: jest.fn(),
  },
  plan: {
    findUnique: jest.fn(),
    findFirst: jest.fn(),
  },
  subscription: {
    create: jest.fn(),
  },
  $transaction: jest.fn((callback) => callback(prismaMock)),
  $connect: jest.fn(),
  $disconnect: jest.fn(),
} as unknown as PrismaClient;

// Set test environment variables
process.env.DATABASE_URL = 'postgresql://test:test@localhost:5432/test';
process.env.JWT_SECRET = 'test-jwt-secret-minimum-32-characters';
process.env.SESSION_SECRET = 'test-session-secret-minimum-32-chars';
process.env.ENCRYPTION_KEY = 'test-encryption-key-minimum-32-chars';
process.env.NODE_ENV = 'test';

// Global test utilities
export const testUtils = {
  /**
   * Generate a mock user
   */
  mockUser(overrides = {}) {
    return {
      id: 'user-123',
      email: 'test@example.com',
      name: 'Test User',
      avatarUrl: null,
      authProvider: 'PASSWORD',
      passwordHash: '$argon2id$v=19$m=65536,t=3,p=4$...', // Mock hash
      googleId: null,
      emailVerified: true,
      emailVerifyToken: null,
      passwordResetToken: null,
      passwordResetExpires: null,
      mfaEnabled: false,
      mfaSecret: null,
      lastLoginAt: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
      ...overrides,
    };
  },

  /**
   * Generate a mock organization
   */
  mockOrganization(overrides = {}) {
    return {
      id: 'org-123',
      name: 'Test Organization',
      slug: 'test-org',
      logoUrl: null,
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
      ...overrides,
    };
  },

  /**
   * Generate a mock membership
   */
  mockMembership(overrides = {}) {
    return {
      id: 'membership-123',
      organizationId: 'org-123',
      userId: 'user-123',
      role: 'MEMBER',
      createdAt: new Date(),
      updatedAt: new Date(),
      ...overrides,
    };
  },

  /**
   * Generate a mock project
   */
  mockProject(overrides = {}) {
    return {
      id: 'project-123',
      organizationId: 'org-123',
      name: 'Test Project',
      description: 'A test project',
      status: 'ACTIVE',
      iconUrl: null,
      createdByUserId: 'user-123',
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
      ...overrides,
    };
  },

  /**
   * Generate mock session
   */
  mockSession(overrides = {}) {
    return {
      id: 'session-123',
      userId: 'user-123',
      tokenHash: 'mock-token-hash',
      userAgent: 'test-agent',
      ipAddress: '127.0.0.1',
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      createdAt: new Date(),
      ...overrides,
    };
  },
};

// Reset all mocks before each test
beforeEach(() => {
  jest.clearAllMocks();
});

// Export for use in tests
export { prismaMock as prisma };
