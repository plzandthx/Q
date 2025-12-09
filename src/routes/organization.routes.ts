/**
 * Organization Routes
 * Handles organization and membership endpoints
 */

import { Router, Request, Response } from 'express';
import { asyncHandler } from '../middleware/error.middleware.js';
import { requireAuth, requireOrganization } from '../middleware/auth.middleware.js';
import * as orgService from '../services/organization.service.js';
import {
  createOrganizationSchema,
  updateOrganizationSchema,
  inviteMemberSchema,
  updateMemberRoleSchema,
  orgQuerySchema,
} from '../schemas/organization.schema.js';
import { OrgRole } from '@prisma/client';

const router = Router();

/**
 * GET /organizations
 * List user's organizations
 */
router.get(
  '/',
  requireAuth,
  asyncHandler(async (req: Request, res: Response) => {
    const query = orgQuerySchema.parse(req.query);
    const result = await orgService.getUserOrganizations(
      req.userId!,
      query.limit,
      query.offset
    );

    res.json(result);
  })
);

/**
 * POST /organizations
 * Create a new organization
 */
router.post(
  '/',
  requireAuth,
  asyncHandler(async (req: Request, res: Response) => {
    const input = createOrganizationSchema.parse(req.body);
    const org = await orgService.createOrganization(req.userId!, input);

    res.status(201).json(org);
  })
);

/**
 * GET /organizations/:orgId
 * Get organization details
 */
router.get(
  '/:orgId',
  requireAuth,
  requireOrganization(OrgRole.VIEWER),
  asyncHandler(async (req: Request, res: Response) => {
    const org = await orgService.getOrganization(
      req.params.orgId,
      req.userId!
    );

    res.json(org);
  })
);

/**
 * PATCH /organizations/:orgId
 * Update organization
 */
router.patch(
  '/:orgId',
  requireAuth,
  requireOrganization(OrgRole.ADMIN),
  asyncHandler(async (req: Request, res: Response) => {
    const input = updateOrganizationSchema.parse(req.body);
    const org = await orgService.updateOrganization(
      req.params.orgId,
      req.userId!,
      input
    );

    res.json(org);
  })
);

/**
 * DELETE /organizations/:orgId
 * Delete organization (soft delete)
 */
router.delete(
  '/:orgId',
  requireAuth,
  requireOrganization(OrgRole.OWNER),
  asyncHandler(async (req: Request, res: Response) => {
    await orgService.deleteOrganization(req.params.orgId, req.userId!);

    res.status(204).send();
  })
);

/**
 * GET /organizations/:orgId/members
 * List organization members
 */
router.get(
  '/:orgId/members',
  requireAuth,
  requireOrganization(OrgRole.VIEWER),
  asyncHandler(async (req: Request, res: Response) => {
    const query = orgQuerySchema.parse(req.query);
    const result = await orgService.getMembers(
      req.params.orgId,
      req.userId!,
      query.limit,
      query.offset
    );

    res.json(result);
  })
);

/**
 * POST /organizations/:orgId/members
 * Invite member to organization
 */
router.post(
  '/:orgId/members',
  requireAuth,
  requireOrganization(OrgRole.ADMIN),
  asyncHandler(async (req: Request, res: Response) => {
    const input = inviteMemberSchema.parse(req.body);
    const member = await orgService.inviteMember(
      req.params.orgId,
      req.userId!,
      input
    );

    res.status(201).json(member);
  })
);

/**
 * PATCH /organizations/:orgId/members/:memberId
 * Update member role
 */
router.patch(
  '/:orgId/members/:memberId',
  requireAuth,
  requireOrganization(OrgRole.ADMIN),
  asyncHandler(async (req: Request, res: Response) => {
    const input = updateMemberRoleSchema.parse(req.body);
    const member = await orgService.updateMemberRole(
      req.params.orgId,
      req.params.memberId,
      req.userId!,
      input
    );

    res.json(member);
  })
);

/**
 * DELETE /organizations/:orgId/members/:memberId
 * Remove member from organization
 */
router.delete(
  '/:orgId/members/:memberId',
  requireAuth,
  requireOrganization(OrgRole.VIEWER), // Users can remove themselves
  asyncHandler(async (req: Request, res: Response) => {
    await orgService.removeMember(
      req.params.orgId,
      req.params.memberId,
      req.userId!
    );

    res.status(204).send();
  })
);

export default router;
