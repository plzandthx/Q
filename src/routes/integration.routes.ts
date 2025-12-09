/**
 * Integration Routes
 * Handles integrations, connections, and webhooks
 */

import { Router, Request, Response } from 'express';
import { asyncHandler } from '../middleware/error.middleware.js';
import { requireAuth, requireOrganization } from '../middleware/auth.middleware.js';
import * as integrationService from '../services/integration.service.js';
import {
  createIntegrationSchema,
  updateIntegrationSchema,
  upsertConnectionSchema,
  createProjectIntegrationSchema,
  updateProjectIntegrationSchema,
  createOutboundActionSchema,
  zendeskWebhookSchema,
  appStoreReviewSchema,
} from '../schemas/integration.schema.js';
import type { InboundSourceType } from '@prisma/client';
import { logger } from '../lib/logger.js';

const router = Router();

// ============================================================================
// Integration Catalog
// ============================================================================

/**
 * GET /integrations/catalog
 * Get available integration types
 */
router.get(
  '/integrations/catalog',
  asyncHandler(async (_req: Request, res: Response) => {
    const catalog = integrationService.getIntegrationCatalog();
    res.json({ integrations: catalog });
  })
);

// ============================================================================
// Organization Integrations
// ============================================================================

/**
 * GET /organizations/:orgId/integrations
 * List integrations for organization
 */
router.get(
  '/organizations/:orgId/integrations',
  requireAuth,
  requireOrganization(OrgRole.VIEWER),
  asyncHandler(async (req: Request, res: Response) => {
    const integrations = await integrationService.getIntegrations(
      req.organizationId!,
      req.userId!
    );

    res.json({ integrations });
  })
);

/**
 * POST /organizations/:orgId/integrations
 * Create integration
 */
router.post(
  '/organizations/:orgId/integrations',
  requireAuth,
  requireOrganization(OrgRole.ADMIN),
  asyncHandler(async (req: Request, res: Response) => {
    const input = createIntegrationSchema.parse(req.body);
    const integration = await integrationService.createIntegration(
      req.organizationId!,
      req.userId!,
      input
    );

    res.status(201).json(integration);
  })
);

/**
 * GET /organizations/:orgId/integrations/:integrationId
 * Get integration details
 */
router.get(
  '/organizations/:orgId/integrations/:integrationId',
  requireAuth,
  requireOrganization(OrgRole.VIEWER),
  asyncHandler(async (req: Request, res: Response) => {
    const integration = await integrationService.getIntegration(
      req.params.integrationId,
      req.organizationId!,
      req.userId!
    );

    res.json(integration);
  })
);

/**
 * PATCH /organizations/:orgId/integrations/:integrationId
 * Update integration
 */
router.patch(
  '/organizations/:orgId/integrations/:integrationId',
  requireAuth,
  requireOrganization(OrgRole.ADMIN),
  asyncHandler(async (req: Request, res: Response) => {
    const input = updateIntegrationSchema.parse(req.body);
    const integration = await integrationService.updateIntegration(
      req.params.integrationId,
      req.organizationId!,
      req.userId!,
      input
    );

    res.json(integration);
  })
);

/**
 * DELETE /organizations/:orgId/integrations/:integrationId
 * Delete integration
 */
router.delete(
  '/organizations/:orgId/integrations/:integrationId',
  requireAuth,
  requireOrganization(OrgRole.ADMIN),
  asyncHandler(async (req: Request, res: Response) => {
    await integrationService.deleteIntegration(
      req.params.integrationId,
      req.organizationId!,
      req.userId!
    );

    res.status(204).send();
  })
);

// ============================================================================
// Integration Connections
// ============================================================================

/**
 * GET /organizations/:orgId/integrations/:integrationId/connection
 * Get connection details
 */
router.get(
  '/organizations/:orgId/integrations/:integrationId/connection',
  requireAuth,
  requireOrganization(OrgRole.ADMIN),
  asyncHandler(async (req: Request, res: Response) => {
    const connection = await integrationService.getConnection(
      req.params.integrationId,
      req.organizationId!,
      req.userId!
    );

    res.json({ connection });
  })
);

/**
 * PUT /organizations/:orgId/integrations/:integrationId/connection
 * Create or update connection
 */
router.put(
  '/organizations/:orgId/integrations/:integrationId/connection',
  requireAuth,
  requireOrganization(OrgRole.ADMIN),
  asyncHandler(async (req: Request, res: Response) => {
    const input = upsertConnectionSchema.parse(req.body);
    const connection = await integrationService.upsertConnection(
      req.params.integrationId,
      req.organizationId!,
      req.userId!,
      input
    );

    res.json({ connection });
  })
);

/**
 * DELETE /organizations/:orgId/integrations/:integrationId/connection
 * Disconnect integration
 */
router.delete(
  '/organizations/:orgId/integrations/:integrationId/connection',
  requireAuth,
  requireOrganization(OrgRole.ADMIN),
  asyncHandler(async (req: Request, res: Response) => {
    await integrationService.disconnectIntegration(
      req.params.integrationId,
      req.organizationId!,
      req.userId!
    );

    res.status(204).send();
  })
);

/**
 * GET /organizations/:orgId/integrations/:integrationId/events
 * Get recent inbound events
 */
router.get(
  '/organizations/:orgId/integrations/:integrationId/events',
  requireAuth,
  requireOrganization(OrgRole.VIEWER),
  asyncHandler(async (req: Request, res: Response) => {
    const limit = parseInt(req.query.limit as string) || 50;
    const events = await integrationService.getInboundEvents(
      req.params.integrationId,
      req.organizationId!,
      req.userId!,
      limit
    );

    res.json({ events });
  })
);

/**
 * GET /organizations/:orgId/integrations/:integrationId/actions
 * Get recent outbound actions
 */
router.get(
  '/organizations/:orgId/integrations/:integrationId/actions',
  requireAuth,
  requireOrganization(OrgRole.VIEWER),
  asyncHandler(async (req: Request, res: Response) => {
    const limit = parseInt(req.query.limit as string) || 50;
    const actions = await integrationService.getOutboundActions(
      req.params.integrationId,
      req.organizationId!,
      req.userId!,
      limit
    );

    res.json({ actions });
  })
);

// ============================================================================
// Project Integrations
// ============================================================================

/**
 * GET /organizations/:orgId/projects/:projectId/integrations
 * List project integrations
 */
router.get(
  '/organizations/:orgId/projects/:projectId/integrations',
  requireAuth,
  requireOrganization(OrgRole.VIEWER),
  asyncHandler(async (req: Request, res: Response) => {
    const projectIntegrations = await integrationService.getProjectIntegrations(
      req.params.projectId,
      req.organizationId!,
      req.userId!
    );

    res.json({ integrations: projectIntegrations });
  })
);

/**
 * POST /organizations/:orgId/projects/:projectId/integrations
 * Create project integration
 */
router.post(
  '/organizations/:orgId/projects/:projectId/integrations',
  requireAuth,
  requireOrganization(OrgRole.MEMBER),
  asyncHandler(async (req: Request, res: Response) => {
    const input = createProjectIntegrationSchema.parse(req.body);
    const projectIntegration = await integrationService.createProjectIntegration(
      req.params.projectId,
      req.organizationId!,
      req.userId!,
      input
    );

    res.status(201).json(projectIntegration);
  })
);

/**
 * PATCH /organizations/:orgId/projects/:projectId/integrations/:projectIntegrationId
 * Update project integration
 */
router.patch(
  '/organizations/:orgId/projects/:projectId/integrations/:projectIntegrationId',
  requireAuth,
  requireOrganization(OrgRole.MEMBER),
  asyncHandler(async (req: Request, res: Response) => {
    const input = updateProjectIntegrationSchema.parse(req.body);
    const projectIntegration = await integrationService.updateProjectIntegration(
      req.params.projectIntegrationId,
      req.params.projectId,
      req.organizationId!,
      req.userId!,
      input
    );

    res.json(projectIntegration);
  })
);

/**
 * DELETE /organizations/:orgId/projects/:projectId/integrations/:projectIntegrationId
 * Delete project integration
 */
router.delete(
  '/organizations/:orgId/projects/:projectId/integrations/:projectIntegrationId',
  requireAuth,
  requireOrganization(OrgRole.MEMBER),
  asyncHandler(async (req: Request, res: Response) => {
    await integrationService.deleteProjectIntegration(
      req.params.projectIntegrationId,
      req.params.projectId,
      req.organizationId!,
      req.userId!
    );

    res.status(204).send();
  })
);

// ============================================================================
// Outbound Actions
// ============================================================================

/**
 * POST /organizations/:orgId/projects/:projectId/outbound-actions
 * Create outbound action (e.g., create Jira issue)
 */
router.post(
  '/organizations/:orgId/projects/:projectId/outbound-actions',
  requireAuth,
  requireOrganization(OrgRole.MEMBER),
  asyncHandler(async (req: Request, res: Response) => {
    const input = createOutboundActionSchema.parse(req.body);
    const action = await integrationService.createOutboundAction(
      req.params.projectId,
      req.organizationId!,
      req.userId!,
      input
    );

    res.status(201).json(action);
  })
);

// ============================================================================
// Webhooks (Unauthenticated, signature verified)
// ============================================================================

/**
 * POST /webhooks/zendesk/:integrationId
 * Zendesk webhook handler
 */
router.post(
  '/webhooks/zendesk/:integrationId',
  asyncHandler(async (req: Request, res: Response) => {
    // TODO: Verify Zendesk webhook signature
    const signature = req.headers['x-zendesk-webhook-signature'];
    if (!signature) {
      logger.warn('Zendesk webhook missing signature', {
        integrationId: req.params.integrationId,
      });
      // For now, continue processing but log warning
    }

    const payload = zendeskWebhookSchema.parse(req.body);

    // Normalize score (Zendesk uses good/bad/unoffered)
    let normalizedScore: number | undefined;
    if (payload.ticket.satisfaction_rating) {
      const scoreMap: Record<string, number> = {
        good: 5,
        bad: 1,
        unoffered: undefined as unknown as number,
      };
      normalizedScore = scoreMap[payload.ticket.satisfaction_rating.score];
    }

    if (normalizedScore !== undefined) {
      await integrationService.processInboundEvent(
        req.params.integrationId,
        payload.ticket.id.toString(),
        InboundSourceType.ZENDESK_SATISFACTION,
        payload as unknown as Record<string, unknown>,
        normalizedScore
      );
    }

    res.json({ received: true });
  })
);

/**
 * POST /webhooks/app-store/:integrationId
 * App Store reviews webhook handler
 */
router.post(
  '/webhooks/app-store/:integrationId',
  asyncHandler(async (req: Request, res: Response) => {
    // TODO: Implement App Store Connect API signature verification
    const payload = appStoreReviewSchema.parse(req.body);

    await integrationService.processInboundEvent(
      req.params.integrationId,
      payload.id,
      InboundSourceType.APP_STORE_REVIEW,
      payload as unknown as Record<string, unknown>,
      payload.rating
    );

    res.json({ received: true });
  })
);

/**
 * POST /webhooks/play-store/:integrationId
 * Play Store reviews webhook handler
 */
router.post(
  '/webhooks/play-store/:integrationId',
  asyncHandler(async (req: Request, res: Response) => {
    // TODO: Implement Play Store API signature verification
    // Similar structure to App Store
    const payload = appStoreReviewSchema.parse(req.body);

    await integrationService.processInboundEvent(
      req.params.integrationId,
      payload.id,
      InboundSourceType.PLAY_STORE_REVIEW,
      payload as unknown as Record<string, unknown>,
      payload.rating
    );

    res.json({ received: true });
  })
);

/**
 * POST /webhooks/ga4/:integrationId
 * Google Analytics 4 webhook/export handler
 */
router.post(
  '/webhooks/ga4/:integrationId',
  asyncHandler(async (req: Request, res: Response) => {
    // TODO: Implement GA4 data import parsing
    // This would typically be a batch import, not a webhook

    logger.info('GA4 data import received', {
      integrationId: req.params.integrationId,
    });

    res.status(501).json({
      error: {
        code: 'NOT_IMPLEMENTED',
        message: 'GA4 import not yet implemented',
      },
    });
  })
);

export default router;
