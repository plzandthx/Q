/**
 * Validation Schema Unit Tests
 */

import { describe, it, expect } from '@jest/globals';
import { z } from 'zod';
import {
  registerSchema,
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
} from '../../src/schemas/auth.schema.js';
import {
  createOrganizationSchema,
  updateOrganizationSchema,
} from '../../src/schemas/organization.schema.js';
import {
  createProjectSchema,
  createPersonaSchema,
  createMomentSchema,
} from '../../src/schemas/project.schema.js';
import {
  createWidgetSchema,
  csatSubmissionSchema,
} from '../../src/schemas/widget.schema.js';

describe('Auth Validation Schemas', () => {
  describe('registerSchema', () => {
    it('should validate valid registration data', () => {
      const validData = {
        email: 'test@example.com',
        password: 'SecurePass123',
        name: 'Test User',
        organizationName: 'My Company',
      };

      const result = registerSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('should reject invalid email', () => {
      const invalidData = {
        email: 'not-an-email',
        password: 'SecurePass123',
        name: 'Test User',
      };

      const result = registerSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('should reject weak password', () => {
      const invalidData = {
        email: 'test@example.com',
        password: '123', // Too short, no letters
        name: 'Test User',
      };

      const result = registerSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('should require password with uppercase', () => {
      const invalidData = {
        email: 'test@example.com',
        password: 'securepass123', // No uppercase
        name: 'Test User',
      };

      const result = registerSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });
  });

  describe('loginSchema', () => {
    it('should validate valid login data', () => {
      const validData = {
        email: 'test@example.com',
        password: 'anypassword',
      };

      const result = loginSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('should reject missing password', () => {
      const invalidData = {
        email: 'test@example.com',
      };

      const result = loginSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });
  });
});

describe('Organization Validation Schemas', () => {
  describe('createOrganizationSchema', () => {
    it('should validate valid organization data', () => {
      const validData = {
        name: 'My Organization',
        slug: 'my-org',
      };

      const result = createOrganizationSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('should accept organization without slug (auto-generated)', () => {
      const validData = {
        name: 'My Organization',
      };

      const result = createOrganizationSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('should reject invalid slug format', () => {
      const invalidData = {
        name: 'My Organization',
        slug: 'Invalid Slug!',
      };

      const result = createOrganizationSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('should reject slug starting with hyphen', () => {
      const invalidData = {
        name: 'My Organization',
        slug: '-my-org',
      };

      const result = createOrganizationSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });
  });
});

describe('Project Validation Schemas', () => {
  describe('createProjectSchema', () => {
    it('should validate valid project data', () => {
      const validData = {
        name: 'My Project',
        description: 'A test project',
      };

      const result = createProjectSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('should accept minimal project data', () => {
      const validData = {
        name: 'My Project',
      };

      const result = createProjectSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('should reject empty name', () => {
      const invalidData = {
        name: '',
      };

      const result = createProjectSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });
  });

  describe('createPersonaSchema', () => {
    it('should validate valid persona data', () => {
      const validData = {
        name: 'Premium Customer',
        description: 'High-value customers',
        attributes: { segment: 'premium' },
      };

      const result = createPersonaSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });
  });

  describe('createMomentSchema', () => {
    it('should validate valid moment data', () => {
      const validData = {
        name: 'Checkout',
        description: 'Purchase flow',
        iconEmoji: '🛒',
        orderIndex: 0,
        personaIds: [],
      };

      const result = createMomentSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('should validate moment with persona IDs', () => {
      const validData = {
        name: 'Checkout',
        personaIds: ['550e8400-e29b-41d4-a716-446655440000'],
      };

      const result = createMomentSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('should reject invalid UUID in personaIds', () => {
      const invalidData = {
        name: 'Checkout',
        personaIds: ['not-a-uuid'],
      };

      const result = createMomentSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });
  });
});

describe('Widget Validation Schemas', () => {
  describe('createWidgetSchema', () => {
    it('should validate valid widget data', () => {
      const validData = {
        type: 'MODAL_CAPTURE',
        name: 'Post-Purchase Survey',
        config: {
          theme: { primaryColor: '#22c55e' },
        },
      };

      const result = createWidgetSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('should reject invalid widget type', () => {
      const invalidData = {
        type: 'INVALID_TYPE',
        name: 'Test Widget',
      };

      const result = createWidgetSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('should reject invalid color format', () => {
      const invalidData = {
        type: 'MODAL_CAPTURE',
        name: 'Test Widget',
        config: {
          theme: { primaryColor: 'not-a-color' },
        },
      };

      const result = createWidgetSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });
  });

  describe('csatSubmissionSchema', () => {
    it('should validate valid submission', () => {
      const validData = {
        score: 5,
        comment: 'Great experience!',
      };

      const result = csatSubmissionSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('should validate submission with moment and persona', () => {
      const validData = {
        score: 4,
        momentId: '550e8400-e29b-41d4-a716-446655440000',
        personaId: '550e8400-e29b-41d4-a716-446655440001',
      };

      const result = csatSubmissionSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('should reject score out of range', () => {
      const invalidData = {
        score: 11, // Max is 10
      };

      const result = csatSubmissionSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('should reject score below minimum', () => {
      const invalidData = {
        score: 0, // Min is 1
      };

      const result = csatSubmissionSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });
  });
});
