/**
 * CSAT Service
 * Handles widgets, responses, and aggregations
 */

import { prisma } from '../lib/prisma.js';
import { NotFoundError, ValidationError, RateLimitError } from '../lib/errors.js';
import { logger } from '../lib/logger.js';
import { generateWidgetPublicKey, hashRespondentId } from '../lib/crypto.js';
import * as orgService from './organization.service.js';
import { checkWidgetLimit, checkResponseLimit } from './plan.service.js';
import { checkWidgetRateLimit } from '../lib/redis.js';
import type {
  CreateWidgetInput,
  UpdateWidgetInput,
  CsatSubmissionInput,
  CsatQueryParams,
  AggregationQueryParams,
  WidgetConfig,
} from '../schemas/widget.schema.js';
import { OrgRole, WidgetType, InboundSourceType } from '@prisma/client';

// ============================================================================
// Types
// ============================================================================

export interface WidgetInfo {
  id: string;
  projectId: string;
  type: WidgetType;
  name: string;
  publicKey: string;
  config: WidgetConfig;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CsatResponseInfo {
  id: string;
  projectId: string;
  momentId: string | null;
  momentName?: string;
  personaId: string | null;
  personaName?: string;
  widgetId: string | null;
  score: number;
  comment: string | null;
  sourceType: InboundSourceType;
  metadata: Record<string, unknown>;
  createdAt: Date;
}

export interface CsatOverview {
  totalResponses: number;
  avgScore: number;
  promoters: number;
  passives: number;
  detractors: number;
  scoreDistribution: Record<number, number>;
  trend: Array<{
    date: string;
    avgScore: number;
    count: number;
  }>;
}

export interface MomentCsatStats {
  momentId: string;
  momentName: string;
  avgScore: number;
  count: number;
  trend: 'up' | 'down' | 'stable';
  trendPercent: number;
}

// ============================================================================
// Widgets
// ============================================================================

/**
 * Get widgets for project
 */
export async function getWidgets(
  projectId: string,
  orgId: string,
  userId: string
): Promise<WidgetInfo[]> {
  await orgService.requireRole(orgId, userId, OrgRole.VIEWER);

  const widgets = await prisma.csatWidget.findMany({
    where: {
      projectId,
      project: { organizationId: orgId },
      deletedAt: null,
    },
    orderBy: { createdAt: 'desc' },
  });

  return widgets.map((w) => ({
    id: w.id,
    projectId: w.projectId,
    type: w.type,
    name: w.name,
    publicKey: w.publicKey,
    config: w.configJson as WidgetConfig,
    isActive: w.isActive,
    createdAt: w.createdAt,
    updatedAt: w.updatedAt,
  }));
}

/**
 * Get widget by ID
 */
export async function getWidget(
  widgetId: string,
  projectId: string,
  orgId: string,
  userId: string
): Promise<WidgetInfo> {
  await orgService.requireRole(orgId, userId, OrgRole.VIEWER);

  const widget = await prisma.csatWidget.findFirst({
    where: {
      id: widgetId,
      projectId,
      project: { organizationId: orgId },
      deletedAt: null,
    },
  });

  if (!widget) {
    throw new NotFoundError('Widget');
  }

  return {
    id: widget.id,
    projectId: widget.projectId,
    type: widget.type,
    name: widget.name,
    publicKey: widget.publicKey,
    config: widget.configJson as WidgetConfig,
    isActive: widget.isActive,
    createdAt: widget.createdAt,
    updatedAt: widget.updatedAt,
  };
}

/**
 * Get widget by public key (for public submission)
 */
export async function getWidgetByPublicKey(publicKey: string): Promise<WidgetInfo | null> {
  const widget = await prisma.csatWidget.findUnique({
    where: { publicKey },
  });

  if (!widget || widget.deletedAt || !widget.isActive) {
    return null;
  }

  return {
    id: widget.id,
    projectId: widget.projectId,
    type: widget.type,
    name: widget.name,
    publicKey: widget.publicKey,
    config: widget.configJson as WidgetConfig,
    isActive: widget.isActive,
    createdAt: widget.createdAt,
    updatedAt: widget.updatedAt,
  };
}

/**
 * Create widget
 */
export async function createWidget(
  projectId: string,
  orgId: string,
  userId: string,
  input: CreateWidgetInput
): Promise<WidgetInfo> {
  await orgService.requireRole(orgId, userId, OrgRole.MEMBER);

  // Verify project access
  const project = await prisma.project.findFirst({
    where: { id: projectId, organizationId: orgId, deletedAt: null },
  });

  if (!project) {
    throw new NotFoundError('Project');
  }

  // Check plan widget limits
  await checkWidgetLimit(orgId);

  const publicKey = generateWidgetPublicKey();

  const widget = await prisma.csatWidget.create({
    data: {
      projectId,
      type: input.type,
      name: input.name,
      publicKey,
      configJson: input.config,
      isActive: input.isActive,
    },
  });

  logger.info('Widget created', {
    widgetId: widget.id,
    projectId,
    userId,
  });

  return {
    id: widget.id,
    projectId: widget.projectId,
    type: widget.type,
    name: widget.name,
    publicKey: widget.publicKey,
    config: widget.configJson as WidgetConfig,
    isActive: widget.isActive,
    createdAt: widget.createdAt,
    updatedAt: widget.updatedAt,
  };
}

/**
 * Update widget
 */
export async function updateWidget(
  widgetId: string,
  projectId: string,
  orgId: string,
  userId: string,
  input: UpdateWidgetInput
): Promise<WidgetInfo> {
  await orgService.requireRole(orgId, userId, OrgRole.MEMBER);

  const widget = await prisma.csatWidget.findFirst({
    where: {
      id: widgetId,
      projectId,
      project: { organizationId: orgId },
      deletedAt: null,
    },
  });

  if (!widget) {
    throw new NotFoundError('Widget');
  }

  const updated = await prisma.csatWidget.update({
    where: { id: widgetId },
    data: {
      name: input.name,
      configJson: input.config ? { ...widget.configJson as object, ...input.config } : undefined,
      isActive: input.isActive,
    },
  });

  logger.info('Widget updated', {
    widgetId,
    projectId,
    userId,
  });

  return {
    id: updated.id,
    projectId: updated.projectId,
    type: updated.type,
    name: updated.name,
    publicKey: updated.publicKey,
    config: updated.configJson as WidgetConfig,
    isActive: updated.isActive,
    createdAt: updated.createdAt,
    updatedAt: updated.updatedAt,
  };
}

/**
 * Delete widget (soft delete)
 */
export async function deleteWidget(
  widgetId: string,
  projectId: string,
  orgId: string,
  userId: string
): Promise<void> {
  await orgService.requireRole(orgId, userId, OrgRole.MEMBER);

  const widget = await prisma.csatWidget.findFirst({
    where: {
      id: widgetId,
      projectId,
      project: { organizationId: orgId },
      deletedAt: null,
    },
  });

  if (!widget) {
    throw new NotFoundError('Widget');
  }

  await prisma.csatWidget.update({
    where: { id: widgetId },
    data: { deletedAt: new Date() },
  });

  logger.info('Widget deleted', {
    widgetId,
    projectId,
    userId,
  });
}

// ============================================================================
// CSAT Responses
// ============================================================================

/**
 * Submit CSAT response (public endpoint)
 */
export async function submitCsatResponse(
  publicKey: string,
  input: CsatSubmissionInput,
  ipAddress?: string
): Promise<{ success: boolean; id: string }> {
  // Get widget
  const widget = await getWidgetByPublicKey(publicKey);

  if (!widget) {
    throw new NotFoundError('Widget');
  }

  // Get organization ID for checking response limits
  const project = await prisma.project.findUnique({
    where: { id: widget.projectId },
    select: { organizationId: true },
  });

  if (project) {
    // Check monthly response limit
    await checkResponseLimit(project.organizationId);
  }

  // Rate limiting per IP / respondent using Redis
  const rateLimitKey = input.respondentId
    ? `respondent:${hashRespondentId(input.respondentId, widget.projectId)}`
    : `ip:${ipAddress ?? 'unknown'}`;

  const rateLimitResult = await checkWidgetRateLimit(widget.id, rateLimitKey);
  if (!rateLimitResult.allowed) {
    const retryAfter = Math.ceil(rateLimitResult.retryAfter / 1000);
    throw new RateLimitError(`Please wait ${retryAfter} seconds before submitting another response`);
  }

  // Validate moment and persona if provided
  if (input.momentId) {
    const moment = await prisma.moment.findFirst({
      where: { id: input.momentId, projectId: widget.projectId, deletedAt: null },
    });
    if (!moment) {
      throw new ValidationError('Invalid moment ID');
    }
  }

  if (input.personaId) {
    const persona = await prisma.persona.findFirst({
      where: { id: input.personaId, projectId: widget.projectId, deletedAt: null },
    });
    if (!persona) {
      throw new ValidationError('Invalid persona ID');
    }
  }

  // Create response
  const response = await prisma.csatResponse.create({
    data: {
      projectId: widget.projectId,
      momentId: input.momentId,
      personaId: input.personaId,
      widgetId: widget.id,
      score: input.score,
      comment: input.comment,
      metadataJson: { ...input.metadata, ipAddress },
      respondentIdentifierHash: input.respondentId
        ? hashRespondentId(input.respondentId, widget.projectId)
        : null,
      sourceType: InboundSourceType.WIDGET_SUBMISSION,
    },
  });

  logger.info('CSAT response submitted', {
    responseId: response.id,
    projectId: widget.projectId,
    widgetId: widget.id,
    score: input.score,
  });

  return { success: true, id: response.id };
}

/**
 * Get CSAT responses for project
 */
export async function getCsatResponses(
  projectId: string,
  orgId: string,
  userId: string,
  query: CsatQueryParams
): Promise<{ responses: CsatResponseInfo[]; total: number }> {
  await orgService.requireRole(orgId, userId, OrgRole.VIEWER);

  const where = {
    projectId,
    project: { organizationId: orgId },
    ...(query.from && { createdAt: { gte: query.from } }),
    ...(query.to && { createdAt: { lte: query.to } }),
    ...(query.momentId && { momentId: query.momentId }),
    ...(query.personaId && { personaId: query.personaId }),
    ...(query.widgetId && { widgetId: query.widgetId }),
  };

  const [responses, total] = await Promise.all([
    prisma.csatResponse.findMany({
      where,
      include: {
        moment: { select: { name: true } },
        persona: { select: { name: true } },
      },
      take: query.limit,
      skip: query.offset,
      orderBy: { createdAt: 'desc' },
    }),
    prisma.csatResponse.count({ where }),
  ]);

  return {
    responses: responses.map((r) => ({
      id: r.id,
      projectId: r.projectId,
      momentId: r.momentId,
      momentName: r.moment?.name,
      personaId: r.personaId,
      personaName: r.persona?.name,
      widgetId: r.widgetId,
      score: r.score,
      comment: r.comment,
      sourceType: r.sourceType,
      metadata: r.metadataJson as Record<string, unknown>,
      createdAt: r.createdAt,
    })),
    total,
  };
}

/**
 * Get CSAT overview for project
 */
export async function getCsatOverview(
  projectId: string,
  orgId: string,
  userId: string,
  from?: Date,
  to?: Date
): Promise<CsatOverview> {
  await orgService.requireRole(orgId, userId, OrgRole.VIEWER);

  const defaultFrom = from ?? new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
  const defaultTo = to ?? new Date();

  const where = {
    projectId,
    project: { organizationId: orgId },
    createdAt: { gte: defaultFrom, lte: defaultTo },
  };

  // Get responses
  const responses = await prisma.csatResponse.findMany({
    where,
    select: { score: true, createdAt: true },
    orderBy: { createdAt: 'asc' },
  });

  if (responses.length === 0) {
    return {
      totalResponses: 0,
      avgScore: 0,
      promoters: 0,
      passives: 0,
      detractors: 0,
      scoreDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
      trend: [],
    };
  }

  // Calculate stats
  const totalResponses = responses.length;
  const avgScore = responses.reduce((sum, r) => sum + r.score, 0) / totalResponses;

  const promoters = responses.filter((r) => r.score >= 4).length;
  const passives = responses.filter((r) => r.score === 3).length;
  const detractors = responses.filter((r) => r.score <= 2).length;

  const scoreDistribution: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  for (const r of responses) {
    const normalizedScore = Math.min(5, Math.max(1, Math.round(r.score)));
    scoreDistribution[normalizedScore]++;
  }

  // Group by date for trend
  const trendMap = new Map<string, { total: number; count: number }>();
  for (const r of responses) {
    const dateKey = r.createdAt.toISOString().split('T')[0];
    const existing = trendMap.get(dateKey) ?? { total: 0, count: 0 };
    existing.total += r.score;
    existing.count++;
    trendMap.set(dateKey, existing);
  }

  const trend = Array.from(trendMap.entries())
    .map(([date, data]) => ({
      date,
      avgScore: data.total / data.count,
      count: data.count,
    }))
    .sort((a, b) => a.date.localeCompare(b.date));

  return {
    totalResponses,
    avgScore,
    promoters,
    passives,
    detractors,
    scoreDistribution,
    trend,
  };
}

/**
 * Get CSAT by moment
 */
export async function getCsatByMoment(
  projectId: string,
  orgId: string,
  userId: string,
  from?: Date,
  to?: Date
): Promise<MomentCsatStats[]> {
  await orgService.requireRole(orgId, userId, OrgRole.VIEWER);

  const defaultFrom = from ?? new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
  const defaultTo = to ?? new Date();
  const previousPeriodDays = Math.round((defaultTo.getTime() - defaultFrom.getTime()) / (24 * 60 * 60 * 1000));
  const previousFrom = new Date(defaultFrom.getTime() - previousPeriodDays * 24 * 60 * 60 * 1000);

  // Get moments
  const moments = await prisma.moment.findMany({
    where: { projectId, deletedAt: null },
    orderBy: { orderIndex: 'asc' },
  });

  // Get responses for current and previous period
  const [currentResponses, previousResponses] = await Promise.all([
    prisma.csatResponse.findMany({
      where: {
        projectId,
        project: { organizationId: orgId },
        momentId: { not: null },
        createdAt: { gte: defaultFrom, lte: defaultTo },
      },
      select: { momentId: true, score: true },
    }),
    prisma.csatResponse.findMany({
      where: {
        projectId,
        project: { organizationId: orgId },
        momentId: { not: null },
        createdAt: { gte: previousFrom, lt: defaultFrom },
      },
      select: { momentId: true, score: true },
    }),
  ]);

  // Calculate stats per moment
  const currentStats = new Map<string, { total: number; count: number }>();
  for (const r of currentResponses) {
    if (!r.momentId) continue;
    const existing = currentStats.get(r.momentId) ?? { total: 0, count: 0 };
    existing.total += r.score;
    existing.count++;
    currentStats.set(r.momentId, existing);
  }

  const previousStats = new Map<string, { total: number; count: number }>();
  for (const r of previousResponses) {
    if (!r.momentId) continue;
    const existing = previousStats.get(r.momentId) ?? { total: 0, count: 0 };
    existing.total += r.score;
    existing.count++;
    previousStats.set(r.momentId, existing);
  }

  return moments.map((m) => {
    const current = currentStats.get(m.id) ?? { total: 0, count: 0 };
    const previous = previousStats.get(m.id) ?? { total: 0, count: 0 };

    const currentAvg = current.count > 0 ? current.total / current.count : 0;
    const previousAvg = previous.count > 0 ? previous.total / previous.count : 0;

    let trend: 'up' | 'down' | 'stable' = 'stable';
    let trendPercent = 0;

    if (previousAvg > 0 && currentAvg > 0) {
      trendPercent = ((currentAvg - previousAvg) / previousAvg) * 100;
      if (trendPercent > 5) {
        trend = 'up';
      } else if (trendPercent < -5) {
        trend = 'down';
      }
    }

    return {
      momentId: m.id,
      momentName: m.name,
      avgScore: currentAvg,
      count: current.count,
      trend,
      trendPercent,
    };
  });
}

/**
 * Generate widget embed code
 */
export function generateEmbedCode(widget: WidgetInfo, baseUrl: string): string {
  const scriptUrl = `${baseUrl}/widget.js`;

  return `<!-- Q CSAT Widget: ${widget.name} -->
<script>
  (function(w,d,s,o,f,js,fjs){
    w['QCSAT']=o;w[o]=w[o]||function(){(w[o].q=w[o].q||[]).push(arguments)};
    js=d.createElement(s);fjs=d.getElementsByTagName(s)[0];
    js.async=1;js.src=f;js.dataset.key='${widget.publicKey}';
    fjs.parentNode.insertBefore(js,fjs);
  }(window,document,'script','qcsat','${scriptUrl}'));
</script>
<!-- End Q CSAT Widget -->`;
}
