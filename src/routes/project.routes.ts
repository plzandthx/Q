/**
 * Project Routes
 * Handles project, persona, and moment endpoints
 */

import { Router, Request, Response } from 'express';
import { asyncHandler } from '../middleware/error.middleware.js';
import { requireAuth, requireOrganization } from '../middleware/auth.middleware.js';
import * as projectService from '../services/project.service.js';
import {
  createProjectSchema,
  updateProjectSchema,
  projectQuerySchema,
  createPersonaSchema,
  updatePersonaSchema,
  createMomentSchema,
  updateMomentSchema,
  reorderMomentsSchema,
} from '../schemas/project.schema.js';
import { OrgRole } from '@prisma/client';

const router = Router();

// All routes require organization context
router.use(requireAuth);

/**
 * GET /organizations/:orgId/projects
 * List projects
 */
router.get(
  '/organizations/:orgId/projects',
  requireOrganization(OrgRole.VIEWER),
  asyncHandler(async (req: Request, res: Response) => {
    const query = projectQuerySchema.parse(req.query);
    const result = await projectService.getProjects(
      req.organizationId!,
      req.userId!,
      query
    );

    res.json(result);
  })
);

/**
 * POST /organizations/:orgId/projects
 * Create project
 */
router.post(
  '/organizations/:orgId/projects',
  requireOrganization(OrgRole.MEMBER),
  asyncHandler(async (req: Request, res: Response) => {
    const input = createProjectSchema.parse(req.body);
    const project = await projectService.createProject(
      req.organizationId!,
      req.userId!,
      input
    );

    res.status(201).json(project);
  })
);

/**
 * GET /organizations/:orgId/projects/:projectId
 * Get project details
 */
router.get(
  '/organizations/:orgId/projects/:projectId',
  requireOrganization(OrgRole.VIEWER),
  asyncHandler(async (req: Request, res: Response) => {
    const project = await projectService.getProject(
      req.params.projectId,
      req.organizationId!,
      req.userId!
    );

    res.json(project);
  })
);

/**
 * PATCH /organizations/:orgId/projects/:projectId
 * Update project
 */
router.patch(
  '/organizations/:orgId/projects/:projectId',
  requireOrganization(OrgRole.MEMBER),
  asyncHandler(async (req: Request, res: Response) => {
    const input = updateProjectSchema.parse(req.body);
    const project = await projectService.updateProject(
      req.params.projectId,
      req.organizationId!,
      req.userId!,
      input
    );

    res.json(project);
  })
);

/**
 * DELETE /organizations/:orgId/projects/:projectId
 * Delete project
 */
router.delete(
  '/organizations/:orgId/projects/:projectId',
  requireOrganization(OrgRole.ADMIN),
  asyncHandler(async (req: Request, res: Response) => {
    await projectService.deleteProject(
      req.params.projectId,
      req.organizationId!,
      req.userId!
    );

    res.status(204).send();
  })
);

// ============================================================================
// Personas
// ============================================================================

/**
 * GET /organizations/:orgId/projects/:projectId/personas
 * List personas
 */
router.get(
  '/organizations/:orgId/projects/:projectId/personas',
  requireOrganization(OrgRole.VIEWER),
  asyncHandler(async (req: Request, res: Response) => {
    const personas = await projectService.getPersonas(
      req.params.projectId,
      req.organizationId!,
      req.userId!
    );

    res.json({ personas });
  })
);

/**
 * POST /organizations/:orgId/projects/:projectId/personas
 * Create persona
 */
router.post(
  '/organizations/:orgId/projects/:projectId/personas',
  requireOrganization(OrgRole.MEMBER),
  asyncHandler(async (req: Request, res: Response) => {
    const input = createPersonaSchema.parse(req.body);
    const persona = await projectService.createPersona(
      req.params.projectId,
      req.organizationId!,
      req.userId!,
      input
    );

    res.status(201).json(persona);
  })
);

/**
 * PATCH /organizations/:orgId/projects/:projectId/personas/:personaId
 * Update persona
 */
router.patch(
  '/organizations/:orgId/projects/:projectId/personas/:personaId',
  requireOrganization(OrgRole.MEMBER),
  asyncHandler(async (req: Request, res: Response) => {
    const input = updatePersonaSchema.parse(req.body);
    const persona = await projectService.updatePersona(
      req.params.personaId,
      req.params.projectId,
      req.organizationId!,
      req.userId!,
      input
    );

    res.json(persona);
  })
);

/**
 * DELETE /organizations/:orgId/projects/:projectId/personas/:personaId
 * Delete persona
 */
router.delete(
  '/organizations/:orgId/projects/:projectId/personas/:personaId',
  requireOrganization(OrgRole.MEMBER),
  asyncHandler(async (req: Request, res: Response) => {
    await projectService.deletePersona(
      req.params.personaId,
      req.params.projectId,
      req.organizationId!,
      req.userId!
    );

    res.status(204).send();
  })
);

// ============================================================================
// Moments
// ============================================================================

/**
 * GET /organizations/:orgId/projects/:projectId/moments
 * List moments
 */
router.get(
  '/organizations/:orgId/projects/:projectId/moments',
  requireOrganization(OrgRole.VIEWER),
  asyncHandler(async (req: Request, res: Response) => {
    const moments = await projectService.getMoments(
      req.params.projectId,
      req.organizationId!,
      req.userId!
    );

    res.json({ moments });
  })
);

/**
 * POST /organizations/:orgId/projects/:projectId/moments
 * Create moment
 */
router.post(
  '/organizations/:orgId/projects/:projectId/moments',
  requireOrganization(OrgRole.MEMBER),
  asyncHandler(async (req: Request, res: Response) => {
    const input = createMomentSchema.parse(req.body);
    const moment = await projectService.createMoment(
      req.params.projectId,
      req.organizationId!,
      req.userId!,
      input
    );

    res.status(201).json(moment);
  })
);

/**
 * PUT /organizations/:orgId/projects/:projectId/moments/reorder
 * Reorder moments
 */
router.put(
  '/organizations/:orgId/projects/:projectId/moments/reorder',
  requireOrganization(OrgRole.MEMBER),
  asyncHandler(async (req: Request, res: Response) => {
    const input = reorderMomentsSchema.parse(req.body);
    const moments = await projectService.reorderMoments(
      req.params.projectId,
      req.organizationId!,
      req.userId!,
      input.momentIds
    );

    res.json({ moments });
  })
);

/**
 * PATCH /organizations/:orgId/projects/:projectId/moments/:momentId
 * Update moment
 */
router.patch(
  '/organizations/:orgId/projects/:projectId/moments/:momentId',
  requireOrganization(OrgRole.MEMBER),
  asyncHandler(async (req: Request, res: Response) => {
    const input = updateMomentSchema.parse(req.body);
    const moment = await projectService.updateMoment(
      req.params.momentId,
      req.params.projectId,
      req.organizationId!,
      req.userId!,
      input
    );

    res.json(moment);
  })
);

/**
 * DELETE /organizations/:orgId/projects/:projectId/moments/:momentId
 * Delete moment
 */
router.delete(
  '/organizations/:orgId/projects/:projectId/moments/:momentId',
  requireOrganization(OrgRole.MEMBER),
  asyncHandler(async (req: Request, res: Response) => {
    await projectService.deleteMoment(
      req.params.momentId,
      req.params.projectId,
      req.organizationId!,
      req.userId!
    );

    res.status(204).send();
  })
);

export default router;
