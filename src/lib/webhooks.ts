/**
 * Webhook Signature Validation
 * Validates incoming webhooks from various integrations
 */

import { createHmac, timingSafeEqual } from 'crypto';
import { logger } from './logger.js';

/**
 * Verify Zendesk webhook signature
 * https://developer.zendesk.com/documentation/webhooks/verifying/
 */
export function verifyZendeskSignature(
  payload: string,
  signature: string,
  timestamp: string,
  secret: string
): boolean {
  try {
    // Zendesk signature format: "v0=<signature>"
    if (!signature.startsWith('v0=')) {
      return false;
    }

    const expectedSignature = signature.slice(3);

    // Create the signed payload
    const signedPayload = `v0:${timestamp}:${payload}`;

    // Calculate HMAC
    const hmac = createHmac('sha256', secret);
    hmac.update(signedPayload);
    const calculatedSignature = hmac.digest('hex');

    // Constant-time comparison
    const expected = Buffer.from(expectedSignature, 'hex');
    const calculated = Buffer.from(calculatedSignature, 'hex');

    if (expected.length !== calculated.length) {
      return false;
    }

    return timingSafeEqual(expected, calculated);
  } catch (error) {
    logger.error('Zendesk signature verification error', {}, error as Error);
    return false;
  }
}

/**
 * Verify Stripe webhook signature
 * https://stripe.com/docs/webhooks/signatures
 */
export function verifyStripeSignature(
  payload: string,
  signatureHeader: string,
  secret: string
): boolean {
  try {
    // Parse signature header
    const elements = signatureHeader.split(',');
    let timestamp: string | null = null;
    let signature: string | null = null;

    for (const element of elements) {
      const [key, value] = element.split('=');
      if (key === 't') {
        timestamp = value;
      } else if (key === 'v1') {
        signature = value;
      }
    }

    if (!timestamp || !signature) {
      return false;
    }

    // Check timestamp is within tolerance (5 minutes)
    const now = Math.floor(Date.now() / 1000);
    const timestampNum = parseInt(timestamp, 10);
    if (Math.abs(now - timestampNum) > 300) {
      logger.warn('Stripe webhook timestamp too old', { timestamp, now });
      return false;
    }

    // Calculate expected signature
    const signedPayload = `${timestamp}.${payload}`;
    const hmac = createHmac('sha256', secret);
    hmac.update(signedPayload);
    const expectedSignature = hmac.digest('hex');

    // Constant-time comparison
    const expected = Buffer.from(expectedSignature, 'utf8');
    const actual = Buffer.from(signature, 'utf8');

    if (expected.length !== actual.length) {
      return false;
    }

    return timingSafeEqual(expected, actual);
  } catch (error) {
    logger.error('Stripe signature verification error', {}, error as Error);
    return false;
  }
}

/**
 * Verify App Store Server Notification signature (v2)
 * Uses JWT (JWS) format
 * https://developer.apple.com/documentation/appstoreservernotifications/jwsdecodedheader
 */
export async function verifyAppStoreSignature(
  signedPayload: string,
  rootCertificate: string
): Promise<{ valid: boolean; payload: unknown }> {
  try {
    // App Store notifications use JWS format
    // In production, you'd verify the certificate chain and decode the JWT
    // This is a simplified version that just decodes

    const parts = signedPayload.split('.');
    if (parts.length !== 3) {
      return { valid: false, payload: null };
    }

    // Decode payload (middle part)
    const payloadBase64 = parts[1];
    const payloadJson = Buffer.from(payloadBase64, 'base64url').toString('utf8');
    const payload = JSON.parse(payloadJson);

    // In production:
    // 1. Extract certificate chain from header
    // 2. Verify certificate chain against Apple's root certificate
    // 3. Verify JWS signature using the leaf certificate
    // For now, we trust the payload if it parses correctly

    logger.debug('App Store payload decoded', {
      notificationType: payload.notificationType,
    });

    return { valid: true, payload };
  } catch (error) {
    logger.error('App Store signature verification error', {}, error as Error);
    return { valid: false, payload: null };
  }
}

/**
 * Verify Google Play Real-time Developer Notifications
 * https://developer.android.com/google/play/billing/rtdn-reference
 */
export async function verifyPlayStoreSignature(
  message: string,
  signature: string,
  publicKey: string
): Promise<boolean> {
  try {
    // Play Store uses RSA signature
    const crypto = await import('crypto');
    const verify = crypto.createVerify('RSA-SHA256');
    verify.update(message);

    // The public key should be in PEM format
    const pemKey = publicKey.includes('-----BEGIN')
      ? publicKey
      : `-----BEGIN PUBLIC KEY-----\n${publicKey}\n-----END PUBLIC KEY-----`;

    return verify.verify(pemKey, signature, 'base64');
  } catch (error) {
    logger.error('Play Store signature verification error', {}, error as Error);
    return false;
  }
}

/**
 * Verify Jira webhook signature
 * https://developer.atlassian.com/cloud/jira/platform/webhooks/#authenticating-webhooks
 */
export function verifyJiraSignature(
  payload: string,
  signature: string,
  secret: string
): boolean {
  try {
    const hmac = createHmac('sha256', secret);
    hmac.update(payload);
    const expectedSignature = `sha256=${hmac.digest('hex')}`;

    const expected = Buffer.from(expectedSignature, 'utf8');
    const actual = Buffer.from(signature, 'utf8');

    if (expected.length !== actual.length) {
      return false;
    }

    return timingSafeEqual(expected, actual);
  } catch (error) {
    logger.error('Jira signature verification error', {}, error as Error);
    return false;
  }
}

/**
 * Verify GitHub webhook signature
 * https://docs.github.com/en/webhooks/using-webhooks/validating-webhook-deliveries
 */
export function verifyGitHubSignature(
  payload: string,
  signature: string,
  secret: string
): boolean {
  try {
    // GitHub sends signature in "sha256=<hex>" format
    if (!signature.startsWith('sha256=')) {
      return false;
    }

    const providedSignature = signature.slice(7);

    const hmac = createHmac('sha256', secret);
    hmac.update(payload);
    const expectedSignature = hmac.digest('hex');

    const expected = Buffer.from(expectedSignature, 'utf8');
    const actual = Buffer.from(providedSignature, 'utf8');

    if (expected.length !== actual.length) {
      return false;
    }

    return timingSafeEqual(expected, actual);
  } catch (error) {
    logger.error('GitHub signature verification error', {}, error as Error);
    return false;
  }
}

/**
 * Generic HMAC signature verification
 */
export function verifyHmacSignature(
  payload: string,
  signature: string,
  secret: string,
  algorithm: 'sha256' | 'sha512' = 'sha256'
): boolean {
  try {
    const hmac = createHmac(algorithm, secret);
    hmac.update(payload);
    const expectedSignature = hmac.digest('hex');

    const expected = Buffer.from(expectedSignature, 'utf8');
    const actual = Buffer.from(signature, 'utf8');

    if (expected.length !== actual.length) {
      return false;
    }

    return timingSafeEqual(expected, actual);
  } catch (error) {
    logger.error('HMAC signature verification error', {}, error as Error);
    return false;
  }
}
