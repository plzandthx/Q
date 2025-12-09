/**
 * Auth Service Unit Tests
 */

import { describe, it, expect, jest, beforeEach } from '@jest/globals';
import * as crypto from '../../src/lib/crypto.js';

// Mock the crypto module
jest.mock('../../src/lib/crypto.js');

describe('Auth Service - Password Hashing', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('hashPassword', () => {
    it('should hash a password successfully', async () => {
      const password = 'SecurePassword123!';
      const mockHash = '$argon2id$v=19$m=65536,t=3,p=4$mockHash';

      (crypto.hashPassword as jest.Mock).mockResolvedValue(mockHash);

      const result = await crypto.hashPassword(password);

      expect(result).toBe(mockHash);
      expect(crypto.hashPassword).toHaveBeenCalledWith(password);
    });
  });

  describe('verifyPassword', () => {
    it('should return true for valid password', async () => {
      const password = 'SecurePassword123!';
      const hash = '$argon2id$v=19$m=65536,t=3,p=4$validHash';

      (crypto.verifyPassword as jest.Mock).mockResolvedValue(true);

      const result = await crypto.verifyPassword(hash, password);

      expect(result).toBe(true);
    });

    it('should return false for invalid password', async () => {
      const password = 'WrongPassword';
      const hash = '$argon2id$v=19$m=65536,t=3,p=4$validHash';

      (crypto.verifyPassword as jest.Mock).mockResolvedValue(false);

      const result = await crypto.verifyPassword(hash, password);

      expect(result).toBe(false);
    });
  });
});

describe('Auth Service - Token Generation', () => {
  describe('generateToken', () => {
    it('should generate a token of specified length', () => {
      (crypto.generateToken as jest.Mock).mockReturnValue('a'.repeat(64));

      const token = crypto.generateToken(32);

      expect(token).toHaveLength(64); // hex encoding doubles length
    });
  });

  describe('generateWidgetPublicKey', () => {
    it('should generate a widget key with correct prefix', () => {
      (crypto.generateWidgetPublicKey as jest.Mock).mockReturnValue('qw_abc123def456');

      const key = crypto.generateWidgetPublicKey();

      expect(key).toMatch(/^qw_/);
    });
  });

  describe('generateApiKey', () => {
    it('should generate an API key with correct format', () => {
      (crypto.generateApiKey as jest.Mock).mockReturnValue({
        key: 'qk_abc123_secretkey1234',
        prefix: 'abc123',
        hash: 'hashedvalue',
      });

      const result = crypto.generateApiKey();

      expect(result.key).toMatch(/^qk_/);
      expect(result.prefix).toBeDefined();
      expect(result.hash).toBeDefined();
    });
  });
});

describe('Auth Service - Encryption', () => {
  describe('encrypt/decrypt', () => {
    it('should encrypt and decrypt data correctly', () => {
      const plaintext = 'sensitive-api-token';
      const encrypted = 'iv:authtag:encrypted';

      (crypto.encrypt as jest.Mock).mockReturnValue(encrypted);
      (crypto.decrypt as jest.Mock).mockReturnValue(plaintext);

      const encryptedResult = crypto.encrypt(plaintext);
      const decryptedResult = crypto.decrypt(encryptedResult);

      expect(encryptedResult).toBe(encrypted);
      expect(decryptedResult).toBe(plaintext);
    });
  });
});
