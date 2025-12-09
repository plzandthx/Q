/**
 * CSAT Routes
 * Handles widgets and CSAT responses
 */

import { Router, Request, Response } from 'express';
import { asyncHandler } from '../middleware/error.middleware.js';
import { requireAuth, requireOrganization, widgetRateLimit } from '../middleware/auth.middleware.js';
import * as csatService from '../services/csat.service.js';
import {
  createWidgetSchema,
  updateWidgetSchema,
  csatSubmissionSchema,
  csatQuerySchema,
  aggregationQuerySchema,
} from '../schemas/widget.schema.js';
import { OrgRole } from '@prisma/client';
import { config } from '../config/index.js';

const router = Router();

// ============================================================================
// Widget Management (Authenticated)
// ============================================================================

/**
 * GET /organizations/:orgId/projects/:projectId/widgets
 * List widgets
 */
router.get(
  '/organizations/:orgId/projects/:projectId/widgets',
  requireAuth,
  requireOrganization(OrgRole.VIEWER),
  asyncHandler(async (req: Request, res: Response) => {
    const widgets = await csatService.getWidgets(
      req.params.projectId,
      req.organizationId!,
      req.userId!
    );

    res.json({ widgets });
  })
);

/**
 * POST /organizations/:orgId/projects/:projectId/widgets
 * Create widget
 */
router.post(
  '/organizations/:orgId/projects/:projectId/widgets',
  requireAuth,
  requireOrganization(OrgRole.MEMBER),
  asyncHandler(async (req: Request, res: Response) => {
    const input = createWidgetSchema.parse(req.body);
    const widget = await csatService.createWidget(
      req.params.projectId,
      req.organizationId!,
      req.userId!,
      input
    );

    // Include embed code in response
    const embedCode = csatService.generateEmbedCode(widget, config.API_URL);

    res.status(201).json({ widget, embedCode });
  })
);

/**
 * GET /organizations/:orgId/projects/:projectId/widgets/:widgetId
 * Get widget details
 */
router.get(
  '/organizations/:orgId/projects/:projectId/widgets/:widgetId',
  requireAuth,
  requireOrganization(OrgRole.VIEWER),
  asyncHandler(async (req: Request, res: Response) => {
    const widget = await csatService.getWidget(
      req.params.widgetId,
      req.params.projectId,
      req.organizationId!,
      req.userId!
    );

    const embedCode = csatService.generateEmbedCode(widget, config.API_URL);

    res.json({ widget, embedCode });
  })
);

/**
 * PATCH /organizations/:orgId/projects/:projectId/widgets/:widgetId
 * Update widget
 */
router.patch(
  '/organizations/:orgId/projects/:projectId/widgets/:widgetId',
  requireAuth,
  requireOrganization(OrgRole.MEMBER),
  asyncHandler(async (req: Request, res: Response) => {
    const input = updateWidgetSchema.parse(req.body);
    const widget = await csatService.updateWidget(
      req.params.widgetId,
      req.params.projectId,
      req.organizationId!,
      req.userId!,
      input
    );

    res.json({ widget });
  })
);

/**
 * DELETE /organizations/:orgId/projects/:projectId/widgets/:widgetId
 * Delete widget
 */
router.delete(
  '/organizations/:orgId/projects/:projectId/widgets/:widgetId',
  requireAuth,
  requireOrganization(OrgRole.MEMBER),
  asyncHandler(async (req: Request, res: Response) => {
    await csatService.deleteWidget(
      req.params.widgetId,
      req.params.projectId,
      req.organizationId!,
      req.userId!
    );

    res.status(204).send();
  })
);

// ============================================================================
// CSAT Analytics (Authenticated)
// ============================================================================

/**
 * GET /organizations/:orgId/projects/:projectId/csat/overview
 * Get CSAT overview
 */
router.get(
  '/organizations/:orgId/projects/:projectId/csat/overview',
  requireAuth,
  requireOrganization(OrgRole.VIEWER),
  asyncHandler(async (req: Request, res: Response) => {
    const query = aggregationQuerySchema.parse(req.query);
    const overview = await csatService.getCsatOverview(
      req.params.projectId,
      req.organizationId!,
      req.userId!,
      query.from,
      query.to
    );

    res.json(overview);
  })
);

/**
 * GET /organizations/:orgId/projects/:projectId/csat/moments
 * Get CSAT by moment
 */
router.get(
  '/organizations/:orgId/projects/:projectId/csat/moments',
  requireAuth,
  requireOrganization(OrgRole.VIEWER),
  asyncHandler(async (req: Request, res: Response) => {
    const query = aggregationQuerySchema.parse(req.query);
    const momentStats = await csatService.getCsatByMoment(
      req.params.projectId,
      req.organizationId!,
      req.userId!,
      query.from,
      query.to
    );

    res.json({ moments: momentStats });
  })
);

/**
 * GET /organizations/:orgId/projects/:projectId/csat/responses
 * List CSAT responses
 */
router.get(
  '/organizations/:orgId/projects/:projectId/csat/responses',
  requireAuth,
  requireOrganization(OrgRole.VIEWER),
  asyncHandler(async (req: Request, res: Response) => {
    const query = csatQuerySchema.parse(req.query);
    const result = await csatService.getCsatResponses(
      req.params.projectId,
      req.organizationId!,
      req.userId!,
      query
    );

    res.json(result);
  })
);

// ============================================================================
// Public Widget Endpoints (Unauthenticated)
// ============================================================================

/**
 * GET /public/widget/:publicKey
 * Get widget configuration for embedding
 */
router.get(
  '/public/widget/:publicKey',
  asyncHandler(async (req: Request, res: Response) => {
    const widget = await csatService.getWidgetByPublicKey(req.params.publicKey);

    if (!widget) {
      res.status(404).json({
        error: {
          code: 'NOT_FOUND',
          message: 'Widget not found',
        },
      });
      return;
    }

    // Only return public configuration
    res.json({
      type: widget.type,
      config: widget.config,
    });
  })
);

/**
 * POST /public/csat/:publicKey/submit
 * Submit CSAT response from widget
 */
router.post(
  '/public/csat/:publicKey/submit',
  widgetRateLimit,
  asyncHandler(async (req: Request, res: Response) => {
    const input = csatSubmissionSchema.parse(req.body);
    const result = await csatService.submitCsatResponse(
      req.params.publicKey,
      input,
      req.ip
    );

    res.status(201).json(result);
  })
);

/**
 * OPTIONS /public/csat/:publicKey/submit
 * CORS preflight for widget submissions
 */
router.options('/public/csat/:publicKey/submit', (_req: Request, res: Response) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.status(204).send();
});

export default router;
