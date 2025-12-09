/**
 * Project, Persona, and Moment validation schemas using Zod
 */

import { z } from 'zod';
import { ProjectStatus } from '@prisma/client';

// UUID param schema
export const uuidParamSchema = z.object({
  id: z.string().uuid('Invalid ID'),
});

// Project schemas
export const createProjectSchema = z.object({
  name: z.string().min(1, 'Name is required').max(255),
  description: z.string().max(5000).optional().nullable(),
  iconUrl: z.string().url().max(500).optional().nullable(),
});

export type CreateProjectInput = z.infer<typeof createProjectSchema>;

export const updateProjectSchema = z.object({
  name: z.string().min(1).max(255).optional(),
  description: z.string().max(5000).optional().nullable(),
  iconUrl: z.string().url().max(500).optional().nullable(),
  status: z.nativeEnum(ProjectStatus).optional(),
});

export type UpdateProjectInput = z.infer<typeof updateProjectSchema>;

export const projectQuerySchema = z.object({
  status: z.nativeEnum(ProjectStatus).optional(),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  offset: z.coerce.number().int().min(0).default(0),
});

export type ProjectQueryParams = z.infer<typeof projectQuerySchema>;

// Persona schemas
export const createPersonaSchema = z.object({
  name: z.string().min(1, 'Name is required').max(255),
  description: z.string().max(5000).optional().nullable(),
  avatarUrl: z.string().url().max(500).optional().nullable(),
  attributes: z.record(z.unknown()).optional().default({}),
});

export type CreatePersonaInput = z.infer<typeof createPersonaSchema>;

export const updatePersonaSchema = z.object({
  name: z.string().min(1).max(255).optional(),
  description: z.string().max(5000).optional().nullable(),
  avatarUrl: z.string().url().max(500).optional().nullable(),
  attributes: z.record(z.unknown()).optional(),
});

export type UpdatePersonaInput = z.infer<typeof updatePersonaSchema>;

// Moment schemas
export const createMomentSchema = z.object({
  name: z.string().min(1, 'Name is required').max(255),
  description: z.string().max(5000).optional().nullable(),
  iconEmoji: z.string().max(10).optional().nullable(),
  orderIndex: z.number().int().min(0).optional().default(0),
  personaIds: z.array(z.string().uuid()).optional().default([]),
});

export type CreateMomentInput = z.infer<typeof createMomentSchema>;

export const updateMomentSchema = z.object({
  name: z.string().min(1).max(255).optional(),
  description: z.string().max(5000).optional().nullable(),
  iconEmoji: z.string().max(10).optional().nullable(),
  orderIndex: z.number().int().min(0).optional(),
  personaIds: z.array(z.string().uuid()).optional(),
});

export type UpdateMomentInput = z.infer<typeof updateMomentSchema>;

// Bulk operations
export const reorderMomentsSchema = z.object({
  momentIds: z.array(z.string().uuid()).min(1),
});

export type ReorderMomentsInput = z.infer<typeof reorderMomentsSchema>;

// Project ID param
export const projectIdParamSchema = z.object({
  projectId: z.string().uuid('Invalid project ID'),
});

export type ProjectIdParam = z.infer<typeof projectIdParamSchema>;

// Resource ID param (for nested resources)
export const resourceIdParamSchema = z.object({
  projectId: z.string().uuid('Invalid project ID'),
  id: z.string().uuid('Invalid resource ID'),
});

export type ResourceIdParam = z.infer<typeof resourceIdParamSchema>;
