/**
 * CSAT Widget and Response validation schemas using Zod
 */

import { z } from 'zod';
import { WidgetType } from '@prisma/client';

// Widget configuration schema (stored in configJson)
export const widgetConfigSchema = z.object({
  theme: z.object({
    primaryColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/).optional(),
    backgroundColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/).optional(),
    textColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/).optional(),
    logoUrl: z.string().url().optional(),
    fontFamily: z.string().max(100).optional(),
  }).optional(),
  triggers: z.object({
    delay: z.number().int().min(0).max(60000).optional(),
    scrollPercentage: z.number().int().min(0).max(100).optional(),
    exitIntent: z.boolean().optional(),
    eventName: z.string().max(100).optional(),
  }).optional(),
  questions: z.object({
    scoreLabel: z.string().max(500).optional(),
    commentLabel: z.string().max(500).optional(),
    commentPlaceholder: z.string().max(500).optional(),
    scoreType: z.enum(['1-5', '1-10', 'emoji', 'nps']).optional(),
    commentRequired: z.boolean().optional(),
  }).optional(),
  copy: z.object({
    title: z.string().max(500).optional(),
    subtitle: z.string().max(1000).optional(),
    submitButton: z.string().max(100).optional(),
    thankYouTitle: z.string().max(500).optional(),
    thankYouMessage: z.string().max(1000).optional(),
  }).optional(),
  behavior: z.object({
    redirectUrl: z.string().url().optional(),
    showOnMobile: z.boolean().optional(),
    position: z.enum(['center', 'bottom-right', 'bottom-left', 'top-right', 'top-left']).optional(),
  }).optional(),
  localization: z.record(z.record(z.string())).optional(), // { "es": { "title": "..." }, "fr": { ... } }
});

export type WidgetConfig = z.infer<typeof widgetConfigSchema>;

// Create widget request
export const createWidgetSchema = z.object({
  type: z.nativeEnum(WidgetType),
  name: z.string().min(1, 'Name is required').max(255),
  config: widgetConfigSchema.optional().default({}),
  isActive: z.boolean().optional().default(true),
});

export type CreateWidgetInput = z.infer<typeof createWidgetSchema>;

// Update widget request
export const updateWidgetSchema = z.object({
  name: z.string().min(1).max(255).optional(),
  config: widgetConfigSchema.optional(),
  isActive: z.boolean().optional(),
});

export type UpdateWidgetInput = z.infer<typeof updateWidgetSchema>;

// Widget ID param
export const widgetIdParamSchema = z.object({
  projectId: z.string().uuid('Invalid project ID'),
  widgetId: z.string().uuid('Invalid widget ID'),
});

export type WidgetIdParam = z.infer<typeof widgetIdParamSchema>;

// Public CSAT submission (from widget)
export const csatSubmissionSchema = z.object({
  score: z.number().int().min(1).max(10),
  comment: z.string().max(5000).optional().nullable(),
  momentId: z.string().uuid().optional().nullable(),
  personaId: z.string().uuid().optional().nullable(),
  respondentId: z.string().max(255).optional().nullable(), // Will be hashed
  metadata: z.record(z.unknown()).optional().default({}),
});

export type CsatSubmissionInput = z.infer<typeof csatSubmissionSchema>;

// CSAT query params
export const csatQuerySchema = z.object({
  from: z.coerce.date().optional(),
  to: z.coerce.date().optional(),
  momentId: z.string().uuid().optional(),
  personaId: z.string().uuid().optional(),
  widgetId: z.string().uuid().optional(),
  limit: z.coerce.number().int().min(1).max(500).default(50),
  offset: z.coerce.number().int().min(0).default(0),
});

export type CsatQueryParams = z.infer<typeof csatQuerySchema>;

// Aggregation query params
export const aggregationQuerySchema = z.object({
  from: z.coerce.date().optional(),
  to: z.coerce.date().optional(),
  momentId: z.string().uuid().optional(),
  personaId: z.string().uuid().optional(),
  granularity: z.enum(['daily', 'weekly', 'monthly']).default('daily'),
});

export type AggregationQueryParams = z.infer<typeof aggregationQuerySchema>;
