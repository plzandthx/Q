/**
 * Organization validation schemas using Zod
 */

import { z } from 'zod';
import { OrgRole } from '@prisma/client';

// Slug validator
const slugSchema = z
  .string()
  .min(3, 'Slug must be at least 3 characters')
  .max(50, 'Slug must be at most 50 characters')
  .regex(/^[a-z0-9-]+$/, 'Slug can only contain lowercase letters, numbers, and hyphens')
  .refine((s) => !s.startsWith('-') && !s.endsWith('-'), 'Slug cannot start or end with a hyphen');

// Create organization request
export const createOrganizationSchema = z.object({
  name: z.string().min(1, 'Name is required').max(255),
  slug: slugSchema.optional(), // Auto-generated if not provided
});

export type CreateOrganizationInput = z.infer<typeof createOrganizationSchema>;

// Update organization request
export const updateOrganizationSchema = z.object({
  name: z.string().min(1).max(255).optional(),
  slug: slugSchema.optional(),
  logoUrl: z.string().url().max(500).optional().nullable(),
});

export type UpdateOrganizationInput = z.infer<typeof updateOrganizationSchema>;

// Invite member request
export const inviteMemberSchema = z.object({
  email: z.string().email('Invalid email address').max(255),
  role: z.nativeEnum(OrgRole).default(OrgRole.MEMBER),
});

export type InviteMemberInput = z.infer<typeof inviteMemberSchema>;

// Update member role request
export const updateMemberRoleSchema = z.object({
  role: z.nativeEnum(OrgRole),
});

export type UpdateMemberRoleInput = z.infer<typeof updateMemberRoleSchema>;

// Organization ID param
export const orgIdParamSchema = z.object({
  orgId: z.string().uuid('Invalid organization ID'),
});

export type OrgIdParam = z.infer<typeof orgIdParamSchema>;

// Member ID param
export const memberIdParamSchema = z.object({
  orgId: z.string().uuid('Invalid organization ID'),
  memberId: z.string().uuid('Invalid member ID'),
});

export type MemberIdParam = z.infer<typeof memberIdParamSchema>;

// Organization query params
export const orgQuerySchema = z.object({
  limit: z.coerce.number().int().min(1).max(100).default(20),
  offset: z.coerce.number().int().min(0).default(0),
});

export type OrgQueryParams = z.infer<typeof orgQuerySchema>;
