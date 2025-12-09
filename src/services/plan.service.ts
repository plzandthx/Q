/**
 * Plan Service
 * Handles plan limits checking and subscription management
 */

import { prisma } from '../lib/prisma.js';
import { ForbiddenError } from '../lib/errors.js';
import { logger } from '../lib/logger.js';
import { getCache, setCache } from '../lib/redis.js';

export interface PlanLimits {
  projectsLimit: number;
  usersLimit: number;
  integrationsLimit: number;
  widgetsLimit: number;
  responsesPerMonth: number;
}

export interface UsageCounts {
  projects: number;
  users: number;
  integrations: number;
  widgets: number;
  responsesThisMonth: number;
}

/**
 * Get organization's current plan limits
 */
export async function getPlanLimits(organizationId: string): Promise<PlanLimits> {
  // Check cache first
  const cacheKey = `plan_limits:${organizationId}`;
  const cached = await getCache<PlanLimits>(cacheKey);
  if (cached) {
    return cached;
  }

  const subscription = await prisma.subscription.findFirst({
    where: {
      organizationId,
      status: { in: ['ACTIVE', 'TRIALING'] },
    },
    include: {
      plan: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  if (!subscription) {
    // Return free tier limits if no subscription
    const limits: PlanLimits = {
      projectsLimit: 1,
      usersLimit: 2,
      integrationsLimit: 2,
      widgetsLimit: 3,
      responsesPerMonth: 100,
    };
    await setCache(cacheKey, limits, 300);
    return limits;
  }

  const limits: PlanLimits = {
    projectsLimit: subscription.plan.projectsLimit,
    usersLimit: subscription.plan.usersLimit,
    integrationsLimit: subscription.plan.integrationsLimit,
    widgetsLimit: subscription.plan.widgetsLimit,
    responsesPerMonth: subscription.plan.responsesPerMonth,
  };

  await setCache(cacheKey, limits, 300);
  return limits;
}

/**
 * Get current usage counts for an organization
 */
export async function getUsageCounts(organizationId: string): Promise<UsageCounts> {
  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);

  const [
    projects,
    users,
    integrations,
    widgets,
    responsesThisMonth,
  ] = await Promise.all([
    prisma.project.count({
      where: { organizationId, deletedAt: null },
    }),
    prisma.orgMembership.count({
      where: { organizationId },
    }),
    prisma.integration.count({
      where: { organizationId, deletedAt: null },
    }),
    prisma.csatWidget.count({
      where: {
        project: { organizationId },
        deletedAt: null,
      },
    }),
    prisma.csatResponse.count({
      where: {
        project: { organizationId },
        createdAt: { gte: startOfMonth },
      },
    }),
  ]);

  return {
    projects,
    users,
    integrations,
    widgets,
    responsesThisMonth,
  };
}

/**
 * Check if organization can create a new project
 */
export async function checkProjectLimit(organizationId: string): Promise<void> {
  const [limits, usage] = await Promise.all([
    getPlanLimits(organizationId),
    getUsageCounts(organizationId),
  ]);

  // -1 means unlimited
  if (limits.projectsLimit !== -1 && usage.projects >= limits.projectsLimit) {
    logger.warn('Project limit reached', { organizationId, limit: limits.projectsLimit });
    throw new ForbiddenError(
      `Project limit reached (${limits.projectsLimit}). Please upgrade your plan.`
    );
  }
}

/**
 * Check if organization can add a new user
 */
export async function checkUserLimit(organizationId: string): Promise<void> {
  const [limits, usage] = await Promise.all([
    getPlanLimits(organizationId),
    getUsageCounts(organizationId),
  ]);

  if (limits.usersLimit !== -1 && usage.users >= limits.usersLimit) {
    logger.warn('User limit reached', { organizationId, limit: limits.usersLimit });
    throw new ForbiddenError(
      `User limit reached (${limits.usersLimit}). Please upgrade your plan.`
    );
  }
}

/**
 * Check if organization can create a new integration
 */
export async function checkIntegrationLimit(organizationId: string): Promise<void> {
  const [limits, usage] = await Promise.all([
    getPlanLimits(organizationId),
    getUsageCounts(organizationId),
  ]);

  if (limits.integrationsLimit !== -1 && usage.integrations >= limits.integrationsLimit) {
    logger.warn('Integration limit reached', { organizationId, limit: limits.integrationsLimit });
    throw new ForbiddenError(
      `Integration limit reached (${limits.integrationsLimit}). Please upgrade your plan.`
    );
  }
}

/**
 * Check if organization can create a new widget
 */
export async function checkWidgetLimit(organizationId: string): Promise<void> {
  const [limits, usage] = await Promise.all([
    getPlanLimits(organizationId),
    getUsageCounts(organizationId),
  ]);

  if (limits.widgetsLimit !== -1 && usage.widgets >= limits.widgetsLimit) {
    logger.warn('Widget limit reached', { organizationId, limit: limits.widgetsLimit });
    throw new ForbiddenError(
      `Widget limit reached (${limits.widgetsLimit}). Please upgrade your plan.`
    );
  }
}

/**
 * Check if organization can receive more responses this month
 */
export async function checkResponseLimit(organizationId: string): Promise<void> {
  const [limits, usage] = await Promise.all([
    getPlanLimits(organizationId),
    getUsageCounts(organizationId),
  ]);

  if (limits.responsesPerMonth !== -1 && usage.responsesThisMonth >= limits.responsesPerMonth) {
    logger.warn('Response limit reached', { organizationId, limit: limits.responsesPerMonth });
    throw new ForbiddenError(
      `Monthly response limit reached (${limits.responsesPerMonth}). Please upgrade your plan.`
    );
  }
}

/**
 * Get organization's usage and limits summary
 */
export async function getUsageSummary(organizationId: string): Promise<{
  limits: PlanLimits;
  usage: UsageCounts;
  percentages: {
    projects: number;
    users: number;
    integrations: number;
    widgets: number;
    responses: number;
  };
}> {
  const [limits, usage] = await Promise.all([
    getPlanLimits(organizationId),
    getUsageCounts(organizationId),
  ]);

  const calculatePercentage = (used: number, limit: number): number => {
    if (limit === -1) return 0; // Unlimited
    if (limit === 0) return 100;
    return Math.min(100, Math.round((used / limit) * 100));
  };

  return {
    limits,
    usage,
    percentages: {
      projects: calculatePercentage(usage.projects, limits.projectsLimit),
      users: calculatePercentage(usage.users, limits.usersLimit),
      integrations: calculatePercentage(usage.integrations, limits.integrationsLimit),
      widgets: calculatePercentage(usage.widgets, limits.widgetsLimit),
      responses: calculatePercentage(usage.responsesThisMonth, limits.responsesPerMonth),
    },
  };
}

/**
 * Invalidate cached plan limits (call after subscription change)
 */
export async function invalidatePlanCache(organizationId: string): Promise<void> {
  const { deleteCache } = await import('../lib/redis.js');
  await deleteCache(`plan_limits:${organizationId}`);
}
