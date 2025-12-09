/**
 * Auth Service
 * Handles user authentication, registration, and session management
 */

import { prisma } from '../lib/prisma.js';
import { hashPassword, verifyPassword, generateToken, sha256 } from '../lib/crypto.js';
import { generateAccessToken, generateRefreshToken, verifyToken, parseDuration } from '../lib/jwt.js';
import {
  UnauthorizedError,
  ConflictError,
  NotFoundError,
  ValidationError,
  RateLimitError,
} from '../lib/errors.js';
import { logger } from '../lib/logger.js';
import { jwtConfig } from '../config/index.js';
import { sendVerificationEmail, sendPasswordResetEmail } from './email.service.js';
import { checkLoginRateLimit, incrementLoginFailure, clearLoginFailures } from '../lib/redis.js';
import type {
  RegisterInput,
  LoginInput,
  ForgotPasswordInput,
  ResetPasswordInput,
  ChangePasswordInput,
} from '../schemas/auth.schema.js';
import { AuthProvider, OrgRole, type User, type Session } from '@prisma/client';

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  avatarUrl: string | null;
  emailVerified: boolean;
  mfaEnabled: boolean;
  createdAt: Date;
}

export interface SessionInfo {
  user: AuthUser;
  organizations: Array<{
    id: string;
    name: string;
    slug: string;
    role: OrgRole;
  }>;
}

/**
 * Generate slug from organization name
 */
function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .substring(0, 50);
}

/**
 * Create a user session
 */
async function createSession(
  userId: string,
  ipAddress?: string,
  userAgent?: string
): Promise<{ session: Session; tokens: AuthTokens }> {
  const sessionId = generateToken(16);
  const tokenHash = sha256(sessionId);
  const expiresAt = new Date(Date.now() + parseDuration(jwtConfig.expiresIn));

  const session = await prisma.session.create({
    data: {
      userId,
      tokenHash,
      ipAddress,
      userAgent,
      expiresAt,
    },
  });

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { email: true },
  });

  if (!user) {
    throw new NotFoundError('User');
  }

  const [accessToken, refreshToken] = await Promise.all([
    generateAccessToken({
      sub: userId,
      email: user.email,
      sessionId: session.id,
    }),
    generateRefreshToken({
      sub: userId,
      sessionId: session.id,
    }),
  ]);

  return {
    session,
    tokens: {
      accessToken,
      refreshToken,
      expiresIn: parseDuration(jwtConfig.expiresIn),
    },
  };
}

/**
 * Register a new user
 */
export async function register(
  input: RegisterInput,
  ipAddress?: string,
  userAgent?: string
): Promise<{ user: AuthUser; tokens: AuthTokens; organizationId?: string }> {
  // Check if email already exists
  const existingUser = await prisma.user.findUnique({
    where: { email: input.email.toLowerCase() },
  });

  if (existingUser) {
    throw new ConflictError('Email already registered');
  }

  // Hash password
  const passwordHash = await hashPassword(input.password);
  const emailVerifyToken = generateToken();

  // Create user and optionally organization in a transaction
  const result = await prisma.$transaction(async (tx) => {
    const user = await tx.user.create({
      data: {
        email: input.email.toLowerCase(),
        name: input.name,
        authProvider: AuthProvider.PASSWORD,
        passwordHash,
        emailVerifyToken,
      },
    });

    let organizationId: string | undefined;

    // If organization name is provided, create it
    if (input.organizationName) {
      const baseSlug = generateSlug(input.organizationName);
      let slug = baseSlug;
      let counter = 1;

      // Ensure unique slug
      while (await tx.organization.findUnique({ where: { slug } })) {
        slug = `${baseSlug}-${counter}`;
        counter++;
      }

      const org = await tx.organization.create({
        data: {
          name: input.organizationName,
          slug,
        },
      });

      // Add user as owner
      await tx.orgMembership.create({
        data: {
          organizationId: org.id,
          userId: user.id,
          role: OrgRole.OWNER,
        },
      });

      // Create default free plan subscription
      const freePlan = await tx.plan.findFirst({
        where: { slug: 'free' },
      });

      if (freePlan) {
        await tx.subscription.create({
          data: {
            organizationId: org.id,
            planId: freePlan.id,
            currentPeriodStart: new Date(),
            currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
          },
        });
      }

      organizationId = org.id;
    }

    return { user, organizationId };
  });

  // Create session
  const { tokens } = await createSession(result.user.id, ipAddress, userAgent);

  // Update last login
  await prisma.user.update({
    where: { id: result.user.id },
    data: { lastLoginAt: new Date() },
  });

  logger.info('User registered', {
    userId: result.user.id,
    email: result.user.email,
  });

  // Send email verification email (async, don't block registration)
  sendVerificationEmail(result.user.email, result.user.name, emailVerifyToken).catch((err) => {
    logger.error('Failed to send verification email', { userId: result.user.id }, err as Error);
  });

  return {
    user: {
      id: result.user.id,
      email: result.user.email,
      name: result.user.name,
      avatarUrl: result.user.avatarUrl,
      emailVerified: result.user.emailVerified,
      mfaEnabled: result.user.mfaEnabled,
      createdAt: result.user.createdAt,
    },
    tokens,
    organizationId: result.organizationId,
  };
}

/**
 * Login with email and password
 */
export async function login(
  input: LoginInput,
  ipAddress?: string,
  userAgent?: string
): Promise<{ user: AuthUser; tokens: AuthTokens }> {
  // Check rate limiting before processing login
  const rateLimitResult = await checkLoginRateLimit(input.email.toLowerCase(), ipAddress ?? 'unknown');
  if (!rateLimitResult.allowed) {
    const retryAfter = Math.ceil(rateLimitResult.retryAfter / 1000);
    logger.warn('Login rate limited', {
      email: input.email,
      ipAddress,
      retryAfter,
    });
    throw new RateLimitError(`Too many login attempts. Please try again in ${retryAfter} seconds.`);
  }

  const user = await prisma.user.findUnique({
    where: { email: input.email.toLowerCase(), deletedAt: null },
  });

  if (!user || !user.passwordHash) {
    // Increment failure counter even for non-existent users (prevent user enumeration)
    await incrementLoginFailure(input.email.toLowerCase(), ipAddress ?? 'unknown');
    throw new UnauthorizedError('Invalid email or password');
  }

  const isValid = await verifyPassword(user.passwordHash, input.password);

  if (!isValid) {
    // Increment failure counter for invalid password
    await incrementLoginFailure(input.email.toLowerCase(), ipAddress ?? 'unknown');
    logger.warn('Failed login attempt', {
      email: input.email,
      ipAddress,
    });
    throw new UnauthorizedError('Invalid email or password');
  }

  // Clear failure counter on successful login
  await clearLoginFailures(input.email.toLowerCase(), ipAddress ?? 'unknown');

  // Create session
  const { tokens } = await createSession(user.id, ipAddress, userAgent);

  // Update last login
  await prisma.user.update({
    where: { id: user.id },
    data: { lastLoginAt: new Date() },
  });

  logger.info('User logged in', {
    userId: user.id,
  });

  return {
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      avatarUrl: user.avatarUrl,
      emailVerified: user.emailVerified,
      mfaEnabled: user.mfaEnabled,
      createdAt: user.createdAt,
    },
    tokens,
  };
}

/**
 * Logout - invalidate session
 */
export async function logout(sessionId: string): Promise<void> {
  await prisma.session.delete({
    where: { id: sessionId },
  }).catch(() => {
    // Session may already be deleted
  });

  logger.info('User logged out', { sessionId });
}

/**
 * Logout from all sessions
 */
export async function logoutAll(userId: string): Promise<void> {
  await prisma.session.deleteMany({
    where: { userId },
  });

  logger.info('User logged out from all sessions', { userId });
}

/**
 * Get current session info
 */
export async function getSessionInfo(userId: string): Promise<SessionInfo> {
  const user = await prisma.user.findUnique({
    where: { id: userId, deletedAt: null },
    include: {
      memberships: {
        include: {
          organization: {
            select: {
              id: true,
              name: true,
              slug: true,
            },
          },
        },
      },
    },
  });

  if (!user) {
    throw new NotFoundError('User');
  }

  return {
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      avatarUrl: user.avatarUrl,
      emailVerified: user.emailVerified,
      mfaEnabled: user.mfaEnabled,
      createdAt: user.createdAt,
    },
    organizations: user.memberships.map((m) => ({
      id: m.organization.id,
      name: m.organization.name,
      slug: m.organization.slug,
      role: m.role,
    })),
  };
}

/**
 * Refresh access token
 */
export async function refreshAccessToken(refreshToken: string): Promise<AuthTokens> {
  const payload = await verifyToken<{ sub: string; sessionId: string; type: string }>(
    refreshToken
  );

  if (payload.type !== 'refresh') {
    throw new UnauthorizedError('Invalid token type');
  }

  // Verify session still exists
  const session = await prisma.session.findUnique({
    where: { id: payload.sessionId },
    include: { user: { select: { email: true } } },
  });

  if (!session || session.expiresAt < new Date()) {
    throw new UnauthorizedError('Session expired');
  }

  // Generate new access token
  const accessToken = await generateAccessToken({
    sub: payload.sub,
    email: session.user.email,
    sessionId: session.id,
  });

  return {
    accessToken,
    refreshToken, // Return same refresh token
    expiresIn: parseDuration(jwtConfig.expiresIn),
  };
}

/**
 * Request password reset
 */
export async function forgotPassword(input: ForgotPasswordInput): Promise<void> {
  const user = await prisma.user.findUnique({
    where: { email: input.email.toLowerCase(), deletedAt: null },
  });

  // Don't reveal if user exists
  if (!user) {
    logger.info('Password reset requested for non-existent email', {
      email: input.email,
    });
    return;
  }

  const resetToken = generateToken();
  const expires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

  await prisma.user.update({
    where: { id: user.id },
    data: {
      passwordResetToken: sha256(resetToken),
      passwordResetExpires: expires,
    },
  });

  // Send password reset email (async, don't block response)
  sendPasswordResetEmail(user.email, user.name, resetToken).catch((err) => {
    logger.error('Failed to send password reset email', { userId: user.id }, err as Error);
  });

  logger.info('Password reset requested', { userId: user.id });
}

/**
 * Reset password with token
 */
export async function resetPassword(input: ResetPasswordInput): Promise<void> {
  const tokenHash = sha256(input.token);

  const user = await prisma.user.findFirst({
    where: {
      passwordResetToken: tokenHash,
      passwordResetExpires: { gt: new Date() },
      deletedAt: null,
    },
  });

  if (!user) {
    throw new ValidationError('Invalid or expired reset token');
  }

  const passwordHash = await hashPassword(input.password);

  await prisma.$transaction([
    prisma.user.update({
      where: { id: user.id },
      data: {
        passwordHash,
        passwordResetToken: null,
        passwordResetExpires: null,
      },
    }),
    // Invalidate all sessions
    prisma.session.deleteMany({
      where: { userId: user.id },
    }),
  ]);

  logger.info('Password reset completed', { userId: user.id });
}

/**
 * Change password (authenticated)
 */
export async function changePassword(
  userId: string,
  input: ChangePasswordInput
): Promise<void> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user || !user.passwordHash) {
    throw new NotFoundError('User');
  }

  const isValid = await verifyPassword(user.passwordHash, input.currentPassword);

  if (!isValid) {
    throw new UnauthorizedError('Current password is incorrect');
  }

  const passwordHash = await hashPassword(input.newPassword);

  await prisma.user.update({
    where: { id: userId },
    data: { passwordHash },
  });

  logger.info('Password changed', { userId });
}

/**
 * Verify email with token
 */
export async function verifyEmail(token: string): Promise<void> {
  const user = await prisma.user.findFirst({
    where: {
      emailVerifyToken: token,
      deletedAt: null,
    },
  });

  if (!user) {
    throw new ValidationError('Invalid verification token');
  }

  await prisma.user.update({
    where: { id: user.id },
    data: {
      emailVerified: true,
      emailVerifyToken: null,
    },
  });

  logger.info('Email verified', { userId: user.id });
}

/**
 * Validate session token
 */
export async function validateSession(
  sessionId: string
): Promise<{ user: User; session: Session } | null> {
  const session = await prisma.session.findUnique({
    where: { id: sessionId },
    include: { user: true },
  });

  if (!session || session.expiresAt < new Date()) {
    return null;
  }

  if (session.user.deletedAt) {
    return null;
  }

  return { user: session.user, session };
}

/**
 * Handle Google OAuth callback
 * Full OAuth flow is implemented in oauth.service.ts (getGoogleAuthUrl, completeGoogleAuth)
 * This function handles the user creation/linking after OAuth verification
 */
export async function handleGoogleAuth(
  googleId: string,
  email: string,
  name: string,
  avatarUrl?: string,
  ipAddress?: string,
  userAgent?: string
): Promise<{ user: AuthUser; tokens: AuthTokens; isNewUser: boolean }> {
  let user = await prisma.user.findFirst({
    where: {
      OR: [
        { googleId },
        { email: email.toLowerCase() },
      ],
      deletedAt: null,
    },
  });

  let isNewUser = false;

  if (!user) {
    // Create new user
    user = await prisma.user.create({
      data: {
        email: email.toLowerCase(),
        name,
        avatarUrl,
        authProvider: AuthProvider.GOOGLE,
        googleId,
        emailVerified: true, // Google emails are verified
      },
    });
    isNewUser = true;
  } else if (!user.googleId) {
    // Link Google account to existing user
    user = await prisma.user.update({
      where: { id: user.id },
      data: {
        googleId,
        avatarUrl: avatarUrl ?? user.avatarUrl,
        emailVerified: true,
      },
    });
  }

  // Create session
  const { tokens } = await createSession(user.id, ipAddress, userAgent);

  // Update last login
  await prisma.user.update({
    where: { id: user.id },
    data: { lastLoginAt: new Date() },
  });

  logger.info('Google auth successful', {
    userId: user.id,
    isNewUser,
  });

  return {
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      avatarUrl: user.avatarUrl,
      emailVerified: user.emailVerified,
      mfaEnabled: user.mfaEnabled,
      createdAt: user.createdAt,
    },
    tokens,
    isNewUser,
  };
}
