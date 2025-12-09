/**
 * Integration validation schemas using Zod
 */

import { z } from 'zod';
import {
  IntegrationType,
  IntegrationDirection,
  ConnectionAuthType,
  OutboundActionType,
} from '@prisma/client';

// Create integration request
export const createIntegrationSchema = z.object({
  type: z.nativeEnum(IntegrationType),
  direction: z.nativeEnum(IntegrationDirection),
  displayName: z.string().min(1, 'Display name is required').max(255),
  description: z.string().max(1000).optional().nullable(),
});

export type CreateIntegrationInput = z.infer<typeof createIntegrationSchema>;

// Update integration request
export const updateIntegrationSchema = z.object({
  displayName: z.string().min(1).max(255).optional(),
  description: z.string().max(1000).optional().nullable(),
  isEnabled: z.boolean().optional(),
});

export type UpdateIntegrationInput = z.infer<typeof updateIntegrationSchema>;

// Connection configuration (varies by integration type)
export const connectionConfigSchema = z.object({
  // Generic fields
  workspace: z.string().max(255).optional(),
  project: z.string().max(255).optional(),
  board: z.string().max(255).optional(),
  channel: z.string().max(255).optional(),

  // Zendesk-specific
  subdomain: z.string().max(100).optional(),

  // Jira-specific
  cloudId: z.string().max(100).optional(),
  projectKey: z.string().max(20).optional(),
  issueType: z.string().max(100).optional(),

  // GA4-specific
  propertyId: z.string().max(50).optional(),

  // App Store / Play Store
  appId: z.string().max(100).optional(),
  country: z.string().length(2).optional(),

  // Custom fields for future extensions
  custom: z.record(z.unknown()).optional(),
});

export type ConnectionConfig = z.infer<typeof connectionConfigSchema>;

// Create/update connection request
export const upsertConnectionSchema = z.object({
  authType: z.nativeEnum(ConnectionAuthType),
  accessToken: z.string().min(1).optional(), // Will be encrypted
  refreshToken: z.string().optional(), // Will be encrypted
  expiresAt: z.coerce.date().optional(),
  config: connectionConfigSchema.optional().default({}),
});

export type UpsertConnectionInput = z.infer<typeof upsertConnectionSchema>;

// OAuth callback
export const oauthCallbackSchema = z.object({
  code: z.string().min(1, 'Authorization code is required'),
  state: z.string().min(1, 'State is required'),
});

export type OAuthCallbackInput = z.infer<typeof oauthCallbackSchema>;

// Project integration settings
export const projectIntegrationSettingsSchema = z.object({
  // Mapping rules
  momentMapping: z.record(z.string().uuid()).optional(), // externalField -> momentId
  personaMapping: z.record(z.string().uuid()).optional(), // externalField -> personaId

  // Filters
  includeFilters: z.array(z.object({
    field: z.string(),
    operator: z.enum(['equals', 'contains', 'startsWith', 'endsWith', 'regex']),
    value: z.string(),
  })).optional(),
  excludeFilters: z.array(z.object({
    field: z.string(),
    operator: z.enum(['equals', 'contains', 'startsWith', 'endsWith', 'regex']),
    value: z.string(),
  })).optional(),

  // Auto-create settings for outbound
  autoCreateRecommendations: z.boolean().optional(),
  taskTemplate: z.object({
    titleTemplate: z.string().max(500).optional(),
    descriptionTemplate: z.string().max(5000).optional(),
    labels: z.array(z.string()).optional(),
    assignee: z.string().optional(),
    priority: z.string().optional(),
  }).optional(),
});

export type ProjectIntegrationSettings = z.infer<typeof projectIntegrationSettingsSchema>;

// Create project integration
export const createProjectIntegrationSchema = z.object({
  integrationId: z.string().uuid('Invalid integration ID'),
  momentId: z.string().uuid().optional().nullable(),
  settings: projectIntegrationSettingsSchema.optional().default({}),
  isEnabled: z.boolean().optional().default(true),
});

export type CreateProjectIntegrationInput = z.infer<typeof createProjectIntegrationSchema>;

// Update project integration
export const updateProjectIntegrationSchema = z.object({
  settings: projectIntegrationSettingsSchema.optional(),
  isEnabled: z.boolean().optional(),
});

export type UpdateProjectIntegrationInput = z.infer<typeof updateProjectIntegrationSchema>;

// Create outbound action
export const createOutboundActionSchema = z.object({
  integrationId: z.string().uuid('Invalid integration ID'),
  momentId: z.string().uuid().optional().nullable(),
  csatResponseId: z.string().uuid().optional().nullable(),
  recommendationId: z.string().uuid().optional().nullable(),
  actionType: z.nativeEnum(OutboundActionType),
  payload: z.record(z.unknown()).default({}),
});

export type CreateOutboundActionInput = z.infer<typeof createOutboundActionSchema>;

// Integration ID params
export const integrationIdParamSchema = z.object({
  integrationId: z.string().uuid('Invalid integration ID'),
});

export type IntegrationIdParam = z.infer<typeof integrationIdParamSchema>;

// Project integration params
export const projectIntegrationParamSchema = z.object({
  projectId: z.string().uuid('Invalid project ID'),
  integrationId: z.string().uuid('Invalid integration ID'),
});

export type ProjectIntegrationParam = z.infer<typeof projectIntegrationParamSchema>;

// Webhook payload schemas (per integration type)
export const zendeskWebhookSchema = z.object({
  ticket: z.object({
    id: z.number(),
    subject: z.string(),
    description: z.string().optional(),
    status: z.string(),
    satisfaction_rating: z.object({
      score: z.string(),
      comment: z.string().optional(),
    }).optional(),
    tags: z.array(z.string()).optional(),
    custom_fields: z.array(z.object({
      id: z.number(),
      value: z.unknown(),
    })).optional(),
  }),
});

export type ZendeskWebhookPayload = z.infer<typeof zendeskWebhookSchema>;

export const appStoreReviewSchema = z.object({
  id: z.string(),
  rating: z.number().int().min(1).max(5),
  title: z.string().optional(),
  body: z.string().optional(),
  author: z.string().optional(),
  version: z.string().optional(),
  date: z.string(),
});

export type AppStoreReviewPayload = z.infer<typeof appStoreReviewSchema>;
