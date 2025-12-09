/**
 * Cryptographic utilities
 * Handles password hashing, token generation, and encryption
 */

import * as argon2 from 'argon2';
import { createCipheriv, createDecipheriv, randomBytes, createHash } from 'crypto';
import { config } from '../config/index.js';

// Argon2 configuration based on OWASP recommendations
const argon2Options = {
  type: argon2.argon2id,
  memoryCost: config.ARGON2_MEMORY_COST,
  timeCost: config.ARGON2_TIME_COST,
  parallelism: config.ARGON2_PARALLELISM,
};

/**
 * Hash a password using Argon2id
 */
export async function hashPassword(password: string): Promise<string> {
  return argon2.hash(password, argon2Options);
}

/**
 * Verify a password against a hash
 */
export async function verifyPassword(hash: string, password: string): Promise<boolean> {
  try {
    return await argon2.verify(hash, password);
  } catch {
    return false;
  }
}

/**
 * Generate a secure random token
 */
export function generateToken(length: number = 32): string {
  return randomBytes(length).toString('hex');
}

/**
 * Generate a URL-safe token
 */
export function generateUrlSafeToken(length: number = 32): string {
  return randomBytes(length).toString('base64url');
}

/**
 * Hash a value using SHA-256 (for non-password data like API keys)
 */
export function sha256(value: string): string {
  return createHash('sha256').update(value).digest('hex');
}

/**
 * Generate a widget public key
 * Format: qw_<random 24 chars>
 */
export function generateWidgetPublicKey(): string {
  return `qw_${generateUrlSafeToken(18)}`;
}

/**
 * Generate an API key
 * Format: qk_<prefix 6 chars>_<secret 32 chars>
 */
export function generateApiKey(): { key: string; prefix: string; hash: string } {
  const prefix = generateUrlSafeToken(4).substring(0, 6);
  const secret = generateUrlSafeToken(24);
  const key = `qk_${prefix}_${secret}`;
  const hash = sha256(key);
  return { key, prefix, hash };
}

// Encryption key derivation (uses config.ENCRYPTION_KEY)
function getEncryptionKey(): Buffer {
  if (!config.ENCRYPTION_KEY) {
    throw new Error('ENCRYPTION_KEY is not configured');
  }
  // Derive a 32-byte key from the config
  return createHash('sha256').update(config.ENCRYPTION_KEY).digest();
}

const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 16;

/**
 * Encrypt sensitive data (e.g., integration tokens)
 */
export function encrypt(plaintext: string): string {
  const key = getEncryptionKey();
  const iv = randomBytes(IV_LENGTH);
  const cipher = createCipheriv(ALGORITHM, key, iv);

  let encrypted = cipher.update(plaintext, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  const authTag = cipher.getAuthTag();

  // Format: iv:authTag:encrypted
  return `${iv.toString('hex')}:${authTag.toString('hex')}:${encrypted}`;
}

/**
 * Decrypt sensitive data
 */
export function decrypt(ciphertext: string): string {
  const key = getEncryptionKey();
  const [ivHex, authTagHex, encrypted] = ciphertext.split(':');

  if (!ivHex || !authTagHex || !encrypted) {
    throw new Error('Invalid ciphertext format');
  }

  const iv = Buffer.from(ivHex, 'hex');
  const authTag = Buffer.from(authTagHex, 'hex');
  const decipher = createDecipheriv(ALGORITHM, key, iv);
  decipher.setAuthTag(authTag);

  let decrypted = decipher.update(encrypted, 'hex', 'utf8');
  decrypted += decipher.final('utf8');

  return decrypted;
}

/**
 * Hash a respondent identifier for anonymization
 */
export function hashRespondentId(identifier: string, salt: string): string {
  return createHash('sha256')
    .update(`${identifier}:${salt}`)
    .digest('hex')
    .substring(0, 32);
}
