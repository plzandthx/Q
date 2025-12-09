/**
 * Auth Routes
 * Handles authentication endpoints
 */

import { Router, Request, Response } from 'express';
import { asyncHandler } from '../middleware/error.middleware.js';
import { requireAuth, loginRateLimit } from '../middleware/auth.middleware.js';
import { cookieConfig } from '../config/index.js';
import * as authService from '../services/auth.service.js';
import {
  registerSchema,
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  verifyEmailSchema,
  changePasswordSchema,
  refreshTokenSchema,
} from '../schemas/auth.schema.js';

const router = Router();

/**
 * POST /auth/register
 * Register a new user
 */
router.post(
  '/register',
  asyncHandler(async (req: Request, res: Response) => {
    const input = registerSchema.parse(req.body);
    const result = await authService.register(
      input,
      req.ip,
      req.headers['user-agent']
    );

    // Set cookies
    res.cookie('access_token', result.tokens.accessToken, cookieConfig);
    res.cookie('refresh_token', result.tokens.refreshToken, {
      ...cookieConfig,
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    });

    res.status(201).json({
      user: result.user,
      organizationId: result.organizationId,
    });
  })
);

/**
 * POST /auth/login
 * Login with email and password
 */
router.post(
  '/login',
  loginRateLimit,
  asyncHandler(async (req: Request, res: Response) => {
    const input = loginSchema.parse(req.body);
    const result = await authService.login(
      input,
      req.ip,
      req.headers['user-agent']
    );

    // Set cookies
    res.cookie('access_token', result.tokens.accessToken, cookieConfig);
    res.cookie('refresh_token', result.tokens.refreshToken, {
      ...cookieConfig,
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });

    res.json({ user: result.user });
  })
);

/**
 * POST /auth/logout
 * Logout current session
 */
router.post(
  '/logout',
  requireAuth,
  asyncHandler(async (req: Request, res: Response) => {
    if (req.sessionId) {
      await authService.logout(req.sessionId);
    }

    res.clearCookie('access_token');
    res.clearCookie('refresh_token');

    res.json({ success: true });
  })
);

/**
 * POST /auth/logout-all
 * Logout from all sessions
 */
router.post(
  '/logout-all',
  requireAuth,
  asyncHandler(async (req: Request, res: Response) => {
    if (req.userId) {
      await authService.logoutAll(req.userId);
    }

    res.clearCookie('access_token');
    res.clearCookie('refresh_token');

    res.json({ success: true });
  })
);

/**
 * GET /auth/me
 * Get current user and organizations
 */
router.get(
  '/me',
  requireAuth,
  asyncHandler(async (req: Request, res: Response) => {
    const sessionInfo = await authService.getSessionInfo(req.userId!);
    res.json(sessionInfo);
  })
);

/**
 * POST /auth/refresh
 * Refresh access token
 */
router.post(
  '/refresh',
  asyncHandler(async (req: Request, res: Response) => {
    const refreshToken =
      req.cookies?.refresh_token ??
      refreshTokenSchema.parse(req.body).refreshToken;

    const tokens = await authService.refreshAccessToken(refreshToken);

    res.cookie('access_token', tokens.accessToken, cookieConfig);

    res.json({ expiresIn: tokens.expiresIn });
  })
);

/**
 * POST /auth/forgot-password
 * Request password reset
 */
router.post(
  '/forgot-password',
  asyncHandler(async (req: Request, res: Response) => {
    const input = forgotPasswordSchema.parse(req.body);
    await authService.forgotPassword(input);

    // Always return success to prevent email enumeration
    res.json({
      message: 'If an account exists, a password reset email will be sent',
    });
  })
);

/**
 * POST /auth/reset-password
 * Reset password with token
 */
router.post(
  '/reset-password',
  asyncHandler(async (req: Request, res: Response) => {
    const input = resetPasswordSchema.parse(req.body);
    await authService.resetPassword(input);

    res.json({ message: 'Password reset successfully' });
  })
);

/**
 * POST /auth/verify-email
 * Verify email with token
 */
router.post(
  '/verify-email',
  asyncHandler(async (req: Request, res: Response) => {
    const input = verifyEmailSchema.parse(req.body);
    await authService.verifyEmail(input.token);

    res.json({ message: 'Email verified successfully' });
  })
);

/**
 * POST /auth/change-password
 * Change password (authenticated)
 */
router.post(
  '/change-password',
  requireAuth,
  asyncHandler(async (req: Request, res: Response) => {
    const input = changePasswordSchema.parse(req.body);
    await authService.changePassword(req.userId!, input);

    res.json({ message: 'Password changed successfully' });
  })
);

/**
 * GET /auth/google
 * Initiate Google OAuth
 * TODO: Implement full OAuth flow
 */
router.get('/google', (_req: Request, res: Response) => {
  res.status(501).json({
    error: {
      code: 'NOT_IMPLEMENTED',
      message: 'Google OAuth not yet implemented',
    },
  });
});

/**
 * GET /auth/google/callback
 * Google OAuth callback
 * TODO: Implement full OAuth flow
 */
router.get('/google/callback', (_req: Request, res: Response) => {
  res.status(501).json({
    error: {
      code: 'NOT_IMPLEMENTED',
      message: 'Google OAuth not yet implemented',
    },
  });
});

export default router;
