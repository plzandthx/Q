/**
 * OAuth Service
 * Handles Google OAuth and other OAuth providers
 */

import { config } from '../config/index.js';
import { logger } from '../lib/logger.js';
import { UnauthorizedError, ValidationError } from '../lib/errors.js';
import { generateToken } from '../lib/crypto.js';
import { setCache, getCache, deleteCache } from '../lib/redis.js';

// OAuth state storage TTL (10 minutes)
const STATE_TTL = 600;

// Google OAuth endpoints
const GOOGLE_AUTH_URL = 'https://accounts.google.com/o/oauth2/v2/auth';
const GOOGLE_TOKEN_URL = 'https://oauth2.googleapis.com/token';
const GOOGLE_USERINFO_URL = 'https://www.googleapis.com/oauth2/v2/userinfo';

export interface GoogleUserInfo {
  id: string;
  email: string;
  verified_email: boolean;
  name: string;
  given_name?: string;
  family_name?: string;
  picture?: string;
}

export interface OAuthState {
  provider: 'google';
  redirectTo?: string;
  createdAt: number;
}

/**
 * Check if Google OAuth is configured
 */
export function isGoogleOAuthConfigured(): boolean {
  return !!(config.GOOGLE_CLIENT_ID && config.GOOGLE_CLIENT_SECRET && config.GOOGLE_CALLBACK_URL);
}

/**
 * Generate Google OAuth authorization URL
 */
export async function getGoogleAuthUrl(redirectTo?: string): Promise<string> {
  if (!isGoogleOAuthConfigured()) {
    throw new ValidationError('Google OAuth is not configured');
  }

  // Generate state token for CSRF protection
  const stateToken = generateToken(16);

  // Store state in Redis
  const state: OAuthState = {
    provider: 'google',
    redirectTo,
    createdAt: Date.now(),
  };

  await setCache(`oauth_state:${stateToken}`, state, STATE_TTL);

  // Build authorization URL
  const params = new URLSearchParams({
    client_id: config.GOOGLE_CLIENT_ID!,
    redirect_uri: config.GOOGLE_CALLBACK_URL!,
    response_type: 'code',
    scope: 'openid email profile',
    state: stateToken,
    access_type: 'offline',
    prompt: 'consent',
  });

  return `${GOOGLE_AUTH_URL}?${params.toString()}`;
}

/**
 * Validate OAuth state token
 */
export async function validateOAuthState(stateToken: string): Promise<OAuthState> {
  const state = await getCache<OAuthState>(`oauth_state:${stateToken}`);

  if (!state) {
    throw new UnauthorizedError('Invalid or expired OAuth state');
  }

  // Clean up used state
  await deleteCache(`oauth_state:${stateToken}`);

  return state;
}

/**
 * Exchange authorization code for tokens
 */
export async function exchangeGoogleCode(code: string): Promise<{
  accessToken: string;
  refreshToken?: string;
  expiresIn: number;
}> {
  if (!isGoogleOAuthConfigured()) {
    throw new ValidationError('Google OAuth is not configured');
  }

  try {
    const response = await fetch(GOOGLE_TOKEN_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: config.GOOGLE_CLIENT_ID!,
        client_secret: config.GOOGLE_CLIENT_SECRET!,
        redirect_uri: config.GOOGLE_CALLBACK_URL!,
        grant_type: 'authorization_code',
        code,
      }).toString(),
    });

    if (!response.ok) {
      const error = await response.text();
      logger.error('Google token exchange failed', { error });
      throw new UnauthorizedError('Failed to exchange authorization code');
    }

    const data = await response.json() as {
      access_token: string;
      refresh_token?: string;
      expires_in: number;
      token_type: string;
    };

    return {
      accessToken: data.access_token,
      refreshToken: data.refresh_token,
      expiresIn: data.expires_in,
    };
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      throw error;
    }
    logger.error('Google token exchange error', {}, error as Error);
    throw new UnauthorizedError('Failed to authenticate with Google');
  }
}

/**
 * Get Google user info using access token
 */
export async function getGoogleUserInfo(accessToken: string): Promise<GoogleUserInfo> {
  try {
    const response = await fetch(GOOGLE_USERINFO_URL, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      const error = await response.text();
      logger.error('Google userinfo fetch failed', { error });
      throw new UnauthorizedError('Failed to get user info from Google');
    }

    const userInfo = await response.json() as GoogleUserInfo;

    if (!userInfo.verified_email) {
      throw new UnauthorizedError('Google email is not verified');
    }

    return userInfo;
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      throw error;
    }
    logger.error('Google userinfo error', {}, error as Error);
    throw new UnauthorizedError('Failed to get user info from Google');
  }
}

/**
 * Complete Google OAuth flow
 * Returns user info that can be used for login/registration
 */
export async function completeGoogleAuth(
  code: string,
  stateToken: string
): Promise<{
  googleId: string;
  email: string;
  name: string;
  avatarUrl?: string;
  redirectTo?: string;
}> {
  // Validate state
  const state = await validateOAuthState(stateToken);

  if (state.provider !== 'google') {
    throw new UnauthorizedError('Invalid OAuth provider');
  }

  // Exchange code for tokens
  const tokens = await exchangeGoogleCode(code);

  // Get user info
  const userInfo = await getGoogleUserInfo(tokens.accessToken);

  logger.info('Google OAuth completed', {
    googleId: userInfo.id,
    email: userInfo.email,
  });

  return {
    googleId: userInfo.id,
    email: userInfo.email,
    name: userInfo.name,
    avatarUrl: userInfo.picture,
    redirectTo: state.redirectTo,
  };
}

/**
 * Refresh Google access token
 */
export async function refreshGoogleToken(refreshToken: string): Promise<{
  accessToken: string;
  expiresIn: number;
}> {
  if (!isGoogleOAuthConfigured()) {
    throw new ValidationError('Google OAuth is not configured');
  }

  try {
    const response = await fetch(GOOGLE_TOKEN_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: config.GOOGLE_CLIENT_ID!,
        client_secret: config.GOOGLE_CLIENT_SECRET!,
        grant_type: 'refresh_token',
        refresh_token: refreshToken,
      }).toString(),
    });

    if (!response.ok) {
      throw new UnauthorizedError('Failed to refresh Google token');
    }

    const data = await response.json() as {
      access_token: string;
      expires_in: number;
    };

    return {
      accessToken: data.access_token,
      expiresIn: data.expires_in,
    };
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      throw error;
    }
    throw new UnauthorizedError('Failed to refresh Google token');
  }
}
